import "reflect-metadata"
function Injectable() {
  return (target: any) => {
    // console.log(target)
  }
}


@Injectable()
class Engine {
  start() {
    console.log("engine started");
  }
}



// 1
// class Car {
//   private engine: Engine;
//   constructor() {
//     this.engine = new Engine();
//   }
//   drive() {
//     this.engine.start();
//     console.log("car is driving");
//   }
// }

// const car = new Car()
// car.drive() // engine started car is driving


// 2
// class Car {
//   private engine: Engine;
//   constructor(engine: Engine) {
//     this.engine = engine
//   }
//   drive() {
//     this.engine.start();
//     console.log("car is driving");
//   }
// }
// const car = new Car(new Engine())
// car.drive() // engine started car is driving

// 3 

@Injectable()
class Car {
  constructor(private engine: Engine) {

  }
  drive() {
    this.engine.start();
    console.log("car is driving");
  }
}


class DIContainer {
  private servers = new Map()
  register(name, server) {
    this.servers.set(name, server)
  }

  resolve(name) {
    const server = this.servers.get(name)
    debugger
    const params = Reflect.getMetadata('design:paramtypes', server) || [];
    const args = params.map((param) => this.resolve(param.name))
    return new server(...args)
  }

}

const container = new DIContainer()
container.register("Engine", Engine)
container.register("Car", Car)


const car = container.resolve('Car');
car.drive()
