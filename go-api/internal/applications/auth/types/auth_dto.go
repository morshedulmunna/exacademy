package Authtypes

type RegisterInput struct {
	Email     string `json:"email" validate:"required,email"`
	Username  string `json:"username" validate:"required,alphanum,min=3,max=30"`
	Password  string `json:"password" validate:"required,min=6,max=72"`
	FirstName string `json:"first_name" validate:"omitempty,min=1,max=50"`
	LastName  string `json:"last_name" validate:"omitempty,min=1,max=50"`
}

// LoginInput represents input data for logging in a user.
type LoginInput struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type TokenPair struct {
	AccessToken string `json:"access_token"`
}
