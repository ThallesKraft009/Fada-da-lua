const chalk = require('colors')
const fs = require('fs');
var AsciiTable = require('ascii-table')
var table = new AsciiTable()
table.setHeading('Comandos', 'Status')

module.exports = (client) => {
    fs.readdirSync('./src/PrefixCommands/').forEach(dir => {
        const files = fs.readdirSync(`./src/PrefixCommands/${dir}/`).filter(file => file.endsWith('.js'));

        if(!files || files.legnth <= 0) console.log(chalk.redBright("0 Comandos Encontrados"))

        files.forEach((file) => {
            let command = require(`../PrefixCommands/${dir}/${file}`)

            if(command) {
                client.prefixo.set(command.name, command)

                if(command.aliases && Array.isArray(command.aliases)) {
                    command.aliases.forEach(alias => {
                        client.aliases.set(alias, command.name)
                    })
                }
                table.addRow(command.name, '✅')
            } else {
                table.addRow(file, '❌  -> erro.')
            }
        })
    })
    console.log(chalk.blue(table.toString()))
}