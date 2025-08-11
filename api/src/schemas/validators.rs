use mongodb::bson::{Document, doc};

/// Collection validators (MongoDB $jsonSchema) centralized in one module.
/// Keeping them here separates schema shape from migration/index logic.
pub mod validators {
    use super::*;

    /// Validator for `users` collection
    pub fn users_validator() -> Document {
        doc! {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["email", "name", "username", "password", "role", "createdAt", "updatedAt"],
                "properties": {
                    "email": {"bsonType": "string"},
                    "name": {"bsonType": "string"},
                    "username": {"bsonType": "string"},
                    "password": {"bsonType": "string"},
                    "role": {"enum": ["USER", "ADMIN"]},
                    "bio": {"bsonType": "string"},
                    "avatar": {"bsonType": "string"},
                    "website": {"bsonType": "string"},
                    "location": {"bsonType": "string"},
                    "createdAt": {"bsonType": "date"},
                    "updatedAt": {"bsonType": "date"}
                }
            }
        }
    }

    /// Validator for `accounts` collection
    pub fn accounts_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required": ["userId","type","provider","providerAccountId"],"properties": {
                "userId": {"bsonType": "objectId"},
                "type": {"bsonType": "string"},
                "provider": {"bsonType": "string"},
                "providerAccountId": {"bsonType": "string"},
                "refresh_token": {"bsonType": "string"},
                "access_token": {"bsonType": "string"},
                "expires_at": {"bsonType": "int"},
                "token_type": {"bsonType": "string"},
                "scope": {"bsonType": "string"},
                "id_token": {"bsonType": "string"},
                "session_state": {"bsonType": "string"}
            }}
        }
    }

    /// Validator for `sessions` collection
    pub fn sessions_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required":["sessionToken","userId","expires"],"properties":{
                "sessionToken": {"bsonType": "string"},
                "userId": {"bsonType": "objectId"},
                "expires": {"bsonType": "date"}
            }}
        }
    }

    /// Validator for `verification_tokens` collection
    pub fn verification_tokens_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required":["identifier","token","expires"],"properties":{
                "identifier": {"bsonType": "string"},
                "token": {"bsonType": "string"},
                "expires": {"bsonType": "date"}
            }}
        }
    }

    /// Validator for `posts` collection
    pub fn posts_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required":["title","slug","content","published","featured","readTime","viewCount","authorId","createdAt","updatedAt"],"properties":{
                "title": {"bsonType": "string"},
                "slug": {"bsonType": "string"},
                "content": {"bsonType": "string"},
                "excerpt": {"bsonType": "string"},
                "coverImage": {"bsonType": "string"},
                "published": {"bsonType": "bool"},
                "featured": {"bsonType": "bool"},
                "readTime": {"bsonType": "int"},
                "viewCount": {"bsonType": "int"},
                "createdAt": {"bsonType": "date"},
                "updatedAt": {"bsonType": "date"},
                "publishedAt": {"bsonType": "date"},
                "authorId": {"bsonType": "objectId"}
            }}
        }
    }

    /// Validator for `tags` collection
    pub fn tags_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required":["name","slug"],"properties":{
                "name": {"bsonType": "string"},
                "slug": {"bsonType": "string"},
                "color": {"bsonType": "string"}
            }}
        }
    }

    /// Validator for `post_tags` collection
    pub fn post_tags_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required":["postId","tagId"],"properties":{
                "postId": {"bsonType": "objectId"},
                "tagId": {"bsonType": "objectId"}
            }}
        }
    }

    /// Validator for `comments` collection
    pub fn comments_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required":["content","authorId","postId","createdAt","updatedAt"],"properties":{
                "content": {"bsonType": "string"},
                "createdAt": {"bsonType": "date"},
                "updatedAt": {"bsonType": "date"},
                "authorId": {"bsonType": "objectId"},
                "postId": {"bsonType": "objectId"},
                "parentId": {"bsonType": "objectId"}
            }}
        }
    }

    /// Validator for `likes` collection
    pub fn likes_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required":["userId","postId","createdAt"],"properties":{
                "createdAt": {"bsonType": "date"},
                "userId": {"bsonType": "objectId"},
                "postId": {"bsonType": "objectId"}
            }}
        }
    }

    /// Validator for `courses` collection
    pub fn courses_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required":["title","slug","description","excerpt","thumbnail","price","originalPrice","duration","lessons","students","published","featured","viewCount","createdAt","updatedAt","instructorId"],"properties":{
                "title": {"bsonType": "string"},
                "slug": {"bsonType": "string"},
                "description": {"bsonType": "string"},
                "excerpt": {"bsonType": "string"},
                "thumbnail": {"bsonType": "string"},
                "price": {"bsonType": "double"},
                "originalPrice": {"bsonType": "double"},
                "duration": {"bsonType": "string"},
                "lessons": {"bsonType": "int"},
                "students": {"bsonType": "int"},
                "published": {"bsonType": "bool"},
                "featured": {"bsonType": "bool"},
                "viewCount": {"bsonType": "int"},
                "createdAt": {"bsonType": "date"},
                "updatedAt": {"bsonType": "date"},
                "publishedAt": {"bsonType": "date"},
                "outcomes": {"bsonType": "array", "items": {"bsonType":"string"}},
                "instructorId": {"bsonType": "objectId"}
            }}
        }
    }

    /// Validator for `course_tags` collection
    pub fn course_tags_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required":["courseId","tagId"],"properties":{
                "courseId": {"bsonType": "objectId"},
                "tagId": {"bsonType": "objectId"}
            }}
        }
    }

    /// Validator for `course_enrollments` collection
    pub fn course_enrollments_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required":["userId","courseId","enrolledAt","completed","progress"],"properties":{
                "enrolledAt": {"bsonType": "date"},
                "completed": {"bsonType": "bool"},
                "progress": {"bsonType": "double"},
                "userId": {"bsonType": "objectId"},
                "courseId": {"bsonType": "objectId"}
            }}
        }
    }

    /// Validator for `course_modules` collection
    pub fn course_modules_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required":["title","order","courseId","createdAt","updatedAt"],"properties":{
                "title": {"bsonType": "string"},
                "description": {"bsonType": "string"},
                "order": {"bsonType": "int"},
                "createdAt": {"bsonType": "date"},
                "updatedAt": {"bsonType": "date"},
                "courseId": {"bsonType": "objectId"}
            }}
        }
    }

    /// Validator for `lessons` collection
    pub fn lessons_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required":["title","content","duration","order","isFree","published","moduleId","createdAt","updatedAt"],"properties":{
                "title": {"bsonType": "string"},
                "description": {"bsonType": "string"},
                "content": {"bsonType": "string"},
                "videoUrl": {"bsonType": "string"},
                "duration": {"bsonType": "string"},
                "order": {"bsonType": "int"},
                "isFree": {"bsonType": "bool"},
                "published": {"bsonType": "bool"},
                "createdAt": {"bsonType": "date"},
                "updatedAt": {"bsonType": "date"},
                "moduleId": {"bsonType": "objectId"}
            }}
        }
    }

    /// Validator for `lesson_contents` collection
    pub fn lesson_contents_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required":["title","type","url","size","filename","lessonId","createdAt"],"properties":{
                "title": {"bsonType": "string"},
                "type": {"enum": ["VIDEO","PDF","DOCUMENT","IMAGE","AUDIO","OTHER"]},
                "url": {"bsonType": "string"},
                "size": {"bsonType": "int"},
                "filename": {"bsonType": "string"},
                "createdAt": {"bsonType": "date"},
                "lessonId": {"bsonType": "objectId"}
            }}
        }
    }

    /// Validator for `course_reviews` collection
    pub fn course_reviews_validator() -> Document {
        doc! {
            "$jsonSchema": {"bsonType": "object","required":["rating","content","userId","courseId","createdAt","updatedAt"],"properties":{
                "rating": {"bsonType": "int", "minimum": 1, "maximum": 5},
                "content": {"bsonType": "string"},
                "createdAt": {"bsonType": "date"},
                "updatedAt": {"bsonType": "date"},
                "userId": {"bsonType": "objectId"},
                "courseId": {"bsonType": "objectId"}
            }}
        }
    }
}
