const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "banir",
  aliases: ["ban"],

  run: async(client, message, args) => {
    let { guild, author } = message;
 author = guild.members.cache.get(`${author.id}`)

if (!author.permissions.has([PermissionsBitField.Flags.BanMembers])) return message.reply({
  content: `Você não tem permissão de **\`Banir Membros\`** pra usar esss comando.`
});

      //  if (!args[0])
let user;
    if (!message.mentions.members.first()) {
      user = client.users.cache.get(args[0]);
    } else {
      user = message.mentions.users.first();
    }

  if (!user) return message.reply({
    content: `:x: | Mencione alguém ou insira o ID do membro.`
  })

    
    const membro = user;
    //console.log(user)

    let motivo = args.slice(1).join(' ') || "Bagunçou tanto que levou uma martelada do ban";

    const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle(`Parece que alguém levou uma chinelada👡`)
    .setDescription(`**🎣| Banido(a):** ${membro.tag}
**🛠️| Staff:** ${message.author.tag} \n**📋| Motivo:** ${motivo}`)
    .setAuthor({ name: `${message.author.tag}🔨⭐`, iconURL: `${message.author.displayAvatarURL()}`})
    .setTimestamp()
    .setFooter({ text: `ID do Membro: ${membro.id} `})
    .setThumbnail(`${membro.displayAvatarURL()}`)
  .setImage("https://media.discordapp.net/attachments/911729113801293845/1089548137133256764/B_A_N_I_D_O_1280x720_378Mbps_2020-11-21_11-31-11.gif")
    message.delete()

  //================ Mensagem de confirmação
    
    const msg = await message.channel.send({
      content: `${author} | Você quer realmente banir **\`${membro.tag}\`**?`
    })
    msg.react("✅");
    msg.react("❌");

  const filter = (reaction, user) => {
	return user.id === message.author.id;
};

const collector = msg.createReactionCollector({ filter, time: 60000 });

collector.on('collect', async(reaction, user) => {
  if (user.id !== message.author.id) return;

  if (reaction.emoji.name === "✅"){

  //  await msg.delete();

    await msg.reactions.removeAll();
    
    msg.edit({
      content: `${author} o usuário**\`${membro.tag}\`** foi banido.`
    });

    let mural = client.channels.cache.get(`${client.chat.mural}`);

    let msg_mural = await mural.send({
      embeds: [embed]
    })
  
    
    await guild.members.ban(membro, { reason: motivo }).catch(e => {
  msg.edit({
    content: `${author} | Não foi possível banir **\`${membro.tag}\`**\n\`\`\`js\n${e}\n\`\`\``
  })

      msg_mural.delete();
});
   
    await collector.stop()
  } else if (reaction.emoji.name === "❌"){
    await msg.delete();

    await collector.stop()
  }
});
  }
}