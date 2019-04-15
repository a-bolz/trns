const fs = require('fs');

module.exports = {
  debug: async (...args) => {
    console.log('preparing statement', args);
    const statement = `${args.map(a => JSON.stringify(a)).join("\n\n")}\n`;
    console.log('logging', statement);
    await fs.appendFile('debug.log', statement, e => {
      if (e) {
        console.log("ERROR WRITING LOG ENTRY");
        throw(e);
      }
    })
  }
}


