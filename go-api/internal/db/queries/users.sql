-- name: GetUserByID :one
SELECT 
    u.id,
    u.email,
    u.username,
    u.first_name,
    u.last_name,
    u.full_name,
    u.profile_pic,
    u.about,
    u.phone,
    u.provider,
    u.provider_id,
    u.is_email_verified,
    u.is_active,
    u.has_access,
    u.last_login_at,
    u.last_failed_login_at,
    u.failed_login_attempts,
    u.password_changed_at,
    u.two_factor_enabled,
    u.created_at,
    u.updated_at,
    -- Role information
    r.name as role_name,
    r.description as role_description,
    -- Profile completion percentage
    CASE 
        WHEN u.profile_pic IS NOT NULL THEN 1 
        ELSE 0 
    END + 
    CASE 
        WHEN u.about IS NOT NULL THEN 1 
        ELSE 0 
    END + 
    CASE 
        WHEN u.phone IS NOT NULL THEN 1 
        ELSE 0 
    END + 
    CASE 
        WHEN u.first_name IS NOT NULL THEN 1 
        ELSE 0 
    END as profile_completion
FROM users u
LEFT JOIN roles r ON u.roles_id = r.id
WHERE u.id = $1 AND u.is_active = true
LIMIT 1;

-- name: GetUserByEmail :one
SELECT 
    u.id,
    u.email,
    u.username,
    u.password,
    u.first_name,
    u.last_name,
    u.full_name,
    u.is_email_verified,
    u.is_active,
    u.has_access,
    u.last_login_at,
    u.last_failed_login_at,
    u.failed_login_attempts,
    u.created_at,
    r.name as role_name,
    r.description as role_description
FROM users u
LEFT JOIN roles r ON u.roles_id = r.id
WHERE u.email = $1 AND u.is_active = true
LIMIT 1;

-- name: GetUserByUsername :one
SELECT 
    u.id,
    u.email,
    u.username,
    u.first_name,
    u.last_name,
    u.full_name,
    u.profile_pic,
    u.about,
    u.is_email_verified,
    u.is_active,
    u.has_access,
    u.created_at,
    r.name as role_name
FROM users u
LEFT JOIN roles r ON u.roles_id = r.id
WHERE u.username = $1 AND u.is_active = true
LIMIT 1;

-- name: ListUsers :many
SELECT 
    u.id,
    u.email,
    u.username,
    u.first_name,
    u.last_name,
    u.full_name,
    u.profile_pic,
    u.about,
    u.is_email_verified,
    u.is_active,
    u.has_access,
    u.last_login_at,
    u.created_at,
    r.name as role_name,
    -- Community membership count
    COUNT(DISTINCT cm.community_id) as community_count,
    -- Post count
    COUNT(DISTINCT cp.id) as post_count,
    -- Last activity
    GREATEST(u.last_login_at, MAX(cp.created_at)) as last_activity
FROM users u
LEFT JOIN roles r ON u.roles_id = r.id
LEFT JOIN community_members cm ON u.id = cm.user_id AND cm.status = 'active'
LEFT JOIN community_posts cp ON u.id = cp.user_id
WHERE u.is_active = true
GROUP BY u.id, r.name
ORDER BY 
    CASE WHEN $3 = 'recent' THEN u.created_at END DESC,
    CASE WHEN $3 = 'active' THEN GREATEST(u.last_login_at, MAX(cp.created_at)) END DESC,
    CASE WHEN $3 = 'name' THEN u.first_name END ASC,
    CASE WHEN $3 = 'name' THEN u.last_name END ASC
LIMIT $1 OFFSET $2;

-- name: SearchUsers :many
SELECT 
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    u.full_name,
    u.profile_pic,
    u.about,
    u.is_email_verified,
    u.created_at,
    r.name as role_name,
    -- Search relevance score
    CASE 
        WHEN u.username ILIKE $1 THEN 100
        WHEN u.first_name ILIKE $1 THEN 80
        WHEN u.last_name ILIKE $1 THEN 80
        WHEN u.about ILIKE $1 THEN 60
        WHEN u.email ILIKE $1 THEN 40
        ELSE 0
    END as relevance_score
FROM users u
LEFT JOIN roles r ON u.roles_id = r.id
WHERE u.is_active = true
    AND (
        u.username ILIKE $1 
        OR u.first_name ILIKE $1 
        OR u.last_name ILIKE $1 
        OR u.about ILIKE $1 
        OR u.email ILIKE $1
    )
ORDER BY relevance_score DESC, u.created_at DESC
LIMIT $2 OFFSET $3;

-- name: GetUsersByRole :many
SELECT 
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    u.full_name,
    u.profile_pic,
    u.email,
    u.is_email_verified,
    u.is_active,
    u.has_access,
    u.created_at,
    u.last_login_at
FROM users u
INNER JOIN roles r ON u.roles_id = r.id
WHERE r.name = $1 AND u.is_active = true
ORDER BY u.created_at DESC
LIMIT $2 OFFSET $3;

-- name: GetUsersByCommunity :many
SELECT 
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    u.full_name,
    u.profile_pic,
    u.about,
    u.is_email_verified,
    u.created_at,
    cm.joined_at,
    cm.status as membership_status,
    cm.is_paid,
    cm.is_subscribe,
    -- User activity in this community
    COUNT(DISTINCT cp.id) as post_count,
    COUNT(DISTINCT pr.id) as reaction_count,
    MAX(cp.created_at) as last_post_date
FROM users u
INNER JOIN community_members cm ON u.id = cm.user_id
LEFT JOIN community_posts cp ON u.id = cp.user_id AND cp.community_id = cm.community_id
LEFT JOIN post_reactions pr ON u.id = pr.user_id AND pr.post_id = cp.id
WHERE cm.community_id = $1 AND u.is_active = true
GROUP BY u.id, cm.joined_at, cm.status, cm.is_paid, cm.is_subscribe
ORDER BY 
    CASE WHEN $2 = 'recent' THEN cm.joined_at END DESC,
    CASE WHEN $2 = 'active' THEN COUNT(DISTINCT cp.id) END DESC,
    CASE WHEN $2 = 'name' THEN u.first_name END ASC,
    CASE WHEN $2 = 'name' THEN u.last_name END ASC
LIMIT $3 OFFSET $4;

-- name: GetUserStats :one
SELECT 
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    u.full_name,
    u.profile_pic,
    u.created_at,
    -- Community statistics
    COUNT(DISTINCT cm.community_id) as total_communities,
    COUNT(DISTINCT CASE WHEN cm.status = 'active' THEN cm.community_id END) as active_communities,
    -- Content statistics
    COUNT(DISTINCT cp.id) as total_posts,
    COUNT(DISTINCT pr.id) as total_reactions_given,
    COUNT(DISTINCT pr2.id) as total_reactions_received,
    -- Activity statistics
    u.last_login_at,
    MAX(cp.created_at) as last_post_date,
    -- Engagement metrics
    CASE 
        WHEN COUNT(DISTINCT cp.id) > 0 
        THEN ROUND(COUNT(DISTINCT pr2.id)::numeric / COUNT(DISTINCT cp.id), 2)
        ELSE 0 
    END as avg_reactions_per_post
FROM users u
LEFT JOIN community_members cm ON u.id = cm.user_id
LEFT JOIN community_posts cp ON u.id = cp.user_id
LEFT JOIN post_reactions pr ON u.id = pr.user_id
LEFT JOIN post_reactions pr2 ON cp.id = pr2.post_id
WHERE u.id = $1 AND u.is_active = true
GROUP BY u.id, u.username, u.first_name, u.last_name, u.full_name, u.profile_pic, u.created_at, u.last_login_at;

-- name: GetTopUsers :many
SELECT 
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    u.full_name,
    u.profile_pic,
    u.about,
    u.created_at,
    -- Activity metrics
    COUNT(DISTINCT cp.id) as post_count,
    COUNT(DISTINCT pr.id) as reaction_count,
    COUNT(DISTINCT cm.community_id) as community_count,
    -- Engagement score (weighted calculation)
    (
        COUNT(DISTINCT cp.id) * 10 + 
        COUNT(DISTINCT pr.id) * 2 + 
        COUNT(DISTINCT cm.community_id) * 5
    ) as engagement_score
FROM users u
LEFT JOIN community_posts cp ON u.id = cp.user_id
LEFT JOIN post_reactions pr ON u.id = pr.user_id
LEFT JOIN community_members cm ON u.id = cm.user_id AND cm.status = 'active'
WHERE u.is_active = true 
    AND u.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.username, u.first_name, u.last_name, u.full_name, u.profile_pic, u.about, u.created_at
HAVING COUNT(DISTINCT cp.id) > 0 OR COUNT(DISTINCT pr.id) > 0
ORDER BY engagement_score DESC, u.created_at DESC
LIMIT $1;

-- name: GetUsersByActivityRange :many
SELECT 
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    u.full_name,
    u.profile_pic,
    u.created_at,
    u.last_login_at,
    COUNT(DISTINCT cp.id) as post_count,
    COUNT(DISTINCT pr.id) as reaction_count,
    COUNT(DISTINCT cm.community_id) as community_count,
    -- Activity level classification
    CASE 
        WHEN COUNT(DISTINCT cp.id) >= 20 AND COUNT(DISTINCT pr.id) >= 50 THEN 'Very Active'
        WHEN COUNT(DISTINCT cp.id) >= 10 AND COUNT(DISTINCT pr.id) >= 25 THEN 'Active'
        WHEN COUNT(DISTINCT cp.id) >= 5 AND COUNT(DISTINCT pr.id) >= 10 THEN 'Moderate'
        WHEN COUNT(DISTINCT cp.id) >= 1 OR COUNT(DISTINCT pr.id) >= 1 THEN 'Occasional'
        ELSE 'Inactive'
    END as activity_level
FROM users u
LEFT JOIN community_posts cp ON u.id = cp.user_id AND cp.created_at >= $1
LEFT JOIN post_reactions pr ON u.id = pr.user_id AND pr.created_at >= $1
LEFT JOIN community_members cm ON u.id = cm.user_id AND cm.joined_at >= $1
WHERE u.is_active = true
GROUP BY u.id, u.username, u.first_name, u.last_name, u.full_name, u.profile_pic, u.created_at, u.last_login_at
ORDER BY 
    CASE WHEN $2 = 'posts' THEN COUNT(DISTINCT cp.id) END DESC,
    CASE WHEN $2 = 'reactions' THEN COUNT(DISTINCT pr.id) END DESC,
    CASE WHEN $2 = 'communities' THEN COUNT(DISTINCT cm.community_id) END DESC,
    CASE WHEN $2 = 'recent' THEN u.last_login_at END DESC
LIMIT $3 OFFSET $4;

-- name: GetUserRecommendations :many
SELECT 
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    u.full_name,
    u.profile_pic,
    u.about,
    u.created_at,
    -- Recommendation score based on common interests
    COUNT(DISTINCT cm.community_id) as common_communities,
    -- Calculate similarity score
    (
        COUNT(DISTINCT cm.community_id) * 3
    ) as similarity_score
FROM users u
INNER JOIN community_members cm ON u.id = cm.user_id
WHERE u.is_active = true 
    AND u.id != $1  -- Exclude the requesting user
    AND cm.community_id IN (
        SELECT community_id 
        FROM community_members 
        WHERE user_id = $1 AND status = 'active'
    )
GROUP BY u.id, u.username, u.first_name, u.last_name, u.full_name, u.profile_pic, u.about, u.created_at
ORDER BY similarity_score DESC, u.created_at DESC
LIMIT $2;


