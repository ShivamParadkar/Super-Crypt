require("@nomiclabs/hardhat-waffle")

module.exports = {
  solidity : '0.8.0',
  networks : {
    ropsten:{
      url: 'https://eth-ropsten.alchemyapi.io/v2/AQeqglCxVGUrf3DktbLnYaaNklrTtNh_',
      accounts:['97ae10a934ddedc083585d9cd9b1eb52ceaa28f514d6b322da52ee4fa801fe03']
    }
  }
}
