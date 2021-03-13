"use strict";

async function main(tank) {

  // variables

  let angle = {
    value: 0,
    addValue: function(n){
      return this.value = (this.value+n)%360
    }
  }

  // auxiliary functions

  async function safeShot() {
    let distance = await tank.scan(angle.value, 10)
    return distance > 0 ? distance : 200
  }
  
  async function seekNDestroy() {
    await tank.shoot(angle.value, await safeShot())
    let gotcha = await tank.scan(angle.value, 5)
    if (gotcha) {
      await tank.shoot(angle.value, gotcha)
      await tank.shoot(angle.value, gotcha)
      await tank.drive(angle.value, 30)
      let wantMore = await tank.scan(angle.value, 10)
      wantMore ? await seekNDestroy() : await checkAround()
    } else {
      await checkAround()
    }
  }

  async function checkHere(n) {
    angle.addValue(n)
    if (await tank.scan(angle.value, 10)) {
      await seekNDestroy()
    }
  }

  async function checkAround() {
    await checkHere(17)
    await checkHere(-34)
    await checkHere(49)
    await checkHere(-81)
    angle.addValue(81)
    await startScan()
  }

  async function startScan() {
    let distance = await tank.scan(angle.value, 10)
    !distance ? angle.addValue(25) && await startScan() : await seekNDestroy()
  }

  // main loop

  while (true) {
    await startScan()
  }
}