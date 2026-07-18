class ApiError extends Error{
  constructor(
    statusCode,
    message= "Something went wrong",
    errors= [],
    stack=""
  ){
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message = message
    this.success = false
    this.errors = errors

    if(stack){ // use that stack provide by dev
      this.stack = stack 
    }else{
      Error.captureStackTrace(this, this.constructor) // if not provided by dev this line automatically create the stack trace
    }
  }
}

export {ApiError}