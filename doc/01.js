class Express {
  middlewares = []
  use(middleware) {
    this.middlewares.push(middleware)
  }

  handleRequest() {
    let { middlewares } = this
    let index = 0
    function next() {
      if (index < middlewares.length) {
        console.log("index=>", index)
        const middleware = middlewares[index++]
        middleware(1, 2, next)
      }
    }

    next()
  }
}

const express = new Express()

express.use((req, res, next) => {
  console.log("middleware1,=>")
  next()
})
express.use((req, res, next) => {
  console.log("middleware2,=>")
  next()
})
express.use((req, res, next) => {
  console.log("middleware3,=>")
})

express.handleRequest()
