const { Client, GatewayIntentBits, PermissionsBitField, SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const token = 'YOUR_BOT_TOKEN';
const clientId = 'YOUR_CLIENT_ID';
const guildId = 'YOUR_GUILD_ID';

const clans = {};
const users = {};
const wars = [];

const commands = [
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of available commands.'),

    new SlashCommandBuilder()
        .setName('create')
        .setDescription('Creates a new clan (admin/owner only).')
        .addUserOption(option =>
            option.setName('clanleader')
                .setDescription('The user to be the clan leader.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('clanname')
                .setDescription('The name of the clan.')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('coleader')
        .setDescription('Adds a co-leader to the clan (leader only).')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to be added as co-leader.')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Invites a user to join your clan (leader/co-leader only).')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to invite.')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('accept')
        .setDescription('Accepts a clan invitation.'),

    new SlashCommandBuilder()
        .setName('decline')
        .setDescription('Declines a clan invitation.'),

    new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Displays your clan profile.'),

    new SlashCommandBuilder()
        .setName('bal')
        .setDescription('Displays your balance.'),

    new SlashCommandBuilder()
        .setName('startwar')
        .setDescription('Starts a war with another clan.')
        .addStringOption(option =>
            option.setName('clanname')
                .setDescription('The name of the clan to declare war on.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('pointsforwin')
                .setDescription('The points awarded for winning the war.')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('wars')
        .setDescription('Displays the number of ongoing wars.'),

    new SlashCommandBuilder()
        .setName('lb')
        .setDescription('Displays the clan leaderboard.'),

    new SlashCommandBuilder()
        .setName('claninfo')
        .setDescription('Displays information about your clan.'),

    new SlashCommandBuilder()
        .setName('toss')
        .setDescription('Flips a coin.'),

    new SlashCommandBuilder()
        .setName('log')
        .setDescription('Logs a win against the specified user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you won against.')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('setbio')
        .setDescription('Sets the clan\'s bio (leader only).')
        .addStringOption(option =>
            option.setName('bio')
                .setDescription('The new clan bio.')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('setavatar')
        .setDescription('Sets the clan\'s avatar (leader only).')
        .addStringOption(option =>
            option.setName('avatar_url')
                .setDescription('The URL of the new clan avatar.')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('setbanner')
        .setDescription('Sets the clan\'s banner (leader only).')
        .addStringOption(option =>
            option.setName('banner_url')
                .setDescription('The URL of the new clan banner.')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member from the clan (leader only).')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick from the clan.')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluates JavaScript code (**OWNER ONLY - VERY DANGEROUS**).')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('The JavaScript code to evaluate.')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('changeav')
        .setDescription('Changes the bot\'s avatar (**OWNER ONLY**).')
        .addStringOption(option =>
            option.setName('avatar_url')
                .setDescription('The URL of the new bot avatar.')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('changebanner')
        .setDescription('Changes the bot\'s banner (**OWNER ONLY**).')
        .addStringOption(option =>
            option.setName('banner_url')
                .setDescription('The URL of the new bot banner.')
                .setRequired(true)),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Managing Clans');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'help') {
        await interaction.reply({
            content: `
**Clan Bot Commands:**

\`/help\` - Displays this help message.
\`/create @clanleader <clan_name>\` - Creates a new clan (admin/owner only).
\`/coleader <@username>\` - Adds a co-leader (leader only).
\`/invite <@username>\` - Invites a user to join your clan (leader/co-leader only).
\`/accept\` - Accepts a clan invitation.
\`/decline\` - Declines a clan invitation.
\`/profile\` - Displays your clan profile.
\`/bal\` - Displays your balance.
\`/startwar <clanname> <pointsforwin>\` - Starts a war with another clan.
\`/wars\` - Displays the number of ongoing wars.
\`/lb\` - Displays the clan leaderboard.
\`/claninfo\` - Displays information about your clan.
\`/toss\` - Flips a coin.
\`/log <user>\` - Logs a win against the specified user.

**Admin/Owner Commands:**

\`/setbio <bio>\` - Sets the clan's bio (leader only).
\`/setavatar <avatar_url>\` - Sets the clan's avatar (leader only).
\`/setbanner <banner_url>\` - Sets the clan's banner (leader only).
\`/kick <@username>\` - Kicks a member from the clan (leader only).
\`/eval <code>\` - Evaluates JavaScript code (**OWNER ONLY - VERY DANGEROUS**).
\`/changeav <avatar_url>\` - Changes the bot's avatar (**OWNER ONLY**).
\`/changebanner <banner_url>\` - Changes the bot's banner (**OWNER ONLY**).
        `,
            ephemeral: true,
        });
    }

    else if (commandName === 'create') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You must be an administrator to use this command.', ephemeral: true });
        }

        const clanLeader = interaction.options.getUser('clanleader');
        const clanName = interaction.options.getString('clanname');

        if (clans[clanName]) {
            return interaction.reply({ content: 'A clan with that name already exists.', ephemeral: true });
        }

        clans[clanName] = {
            leaderId: clanLeader.id,
            coleaders: [],
            members: [clanLeader.id],
            bio: 'No bio set.',
            avatar: null,
            banner: null,
        };

        users[clanLeader.id] = {
            clan: clanName,
            balance: 0,
        };

        await interaction.reply({ content: `Clan "${clanName}" created with ${clanLeader.username} as the leader!` });
    }

    else if (commandName === 'coleader') {
        const coleader = interaction.options.getUser('user');

        const clanName = users[interaction.user.id]?.clan;
        if (!clanName) {
            return interaction.reply({ content: 'You are not in a clan.', ephemeral: true });
        }
        if (clans[clanName].leaderId !== interaction.user.id) {
            return interaction.reply({ content: 'You are not the clan leader.', ephemeral: true });
        }
        if (clans[clanName].coleaders.includes(coleader.id)) {
            return interaction.reply({ content: 'That user is already a co-leader.', ephemeral: true });
        }

        clans[clanName].coleaders.push(coleader.id);
        await interaction.reply({ content: `${coleader.username} is now a co-leader of ${clanName}!` });
    }

    else if (commandName === 'invite') {
        const userToInvite = interaction.options.getUser('user');

        const clanName = users[interaction.user.id]?.clan;
        if (!clanName) {
            return interaction.reply({ content: 'You are not in a clan.', ephemeral: true });
        }

        if (clans[clanName].leaderId !== interaction.user.id && !clans[clanName].coleaders.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You are not a leader or co-leader of this clan.', ephemeral: true });
        }

        if (users[userToInvite.id]?.clan) {
            return interaction.reply({ content: 'That user is already in a clan.', ephemeral: true });
        }

        users[userToInvite.id] = users[userToInvite.id] || {};
        users[userToInvite.id].invite = clanName;
        await interaction.reply({ content: `${userToInvite}, ${interaction.user} has invited you to join ${clanName}! Type /accept or /decline` });

    }

        else if (commandName === 'accept') {
            const clanName = users[interaction.user.id]?.invite;
            if (!clanName) {
                return interaction.reply({ content: 'You have not been invited to any clan.', ephemeral: true });
            }

            users[interaction.user.id].clan = clanName;
            clans[clanName].members.push(interaction.user.id);
            delete users[interaction.user.id].invite;

            await interaction.reply({ content: `You have joined ${clanName}!` });
        }

        else if (commandName === 'decline') {
            if (!users[interaction.user.id]?.invite) {
                return interaction.reply({ content: 'You have not been invited to any clan.', ephemeral: true });
            }

            delete users[interaction.user.id].invite;
            await interaction.reply({ content: 'You have declined the clan invitation.' });
        }

    else if (commandName === 'profile') {
        const clanName = users[interaction.user.id]?.clan;
        if (!clanName) {
            return interaction.reply({ content: 'You are not in a clan.', ephemeral: true });
        }

        const clan = clans[clanName];
        const leader = client.users.cache.get(clan.leaderId);
        const coleaders = clan.coleaders.map(id => client.users.cache.get(id).username).join(', ') || 'None';
        const members = clan.members.map(id => client.users.cache.get(id).username).join(', ');

        await interaction.reply({
            content: `
**Clan Profile: ${clanName}**
Leader: ${leader.username}
Co-Leaders: ${coleaders}
Members: ${members}
Bio: ${clan.bio}
        `,
        });
    }

    else if (commandName === 'bal') {
        const balance = users[interaction.user.id]?.balance || 0;
        await interaction.reply({ content: `Your balance is: ${balance}` });
    }

    else if (commandName === 'startwar') {
        const targetClanName = interaction.options.getString('clanname');
        const pointsForWin = interaction.options.getInteger('pointsforwin');

        const initiatingClanName = users[interaction.user.id]?.clan;
        if (!initiatingClanName) {
            return interaction.reply({ content: 'You are not in a clan.', ephemeral: true });
        }

        if (!clans[targetClanName]) {
            return interaction.reply({ content: 'That clan does not exist.', ephemeral: true });
        }
        if (initiatingClanName === targetClanName) {
            return interaction.reply({ content: 'You cannot declare war on your own clan.', ephemeral: true });
        }

        if (clans[initiatingClanName].leaderId !== interaction.user.id && !clans[initiatingClanName].coleaders.includes(interaction.user.id)) {
            return interaction.reply({ content: 'Only the leader or co-leaders can start a war.', ephemeral: true });
        }

        const war = {
            clan1: initiatingClanName,
            clan2: targetClanName,
            pointsForWin: pointsForWin,
            status: 'ongoing',
        };

        wars.push(war);
        await interaction.reply({ content: `War declared between ${initiatingClanName} and ${targetClanName} for ${pointsForWin} points!` });
    }

    else if (commandName === 'wars') {
        if (wars.length === 0) {
            return interaction.reply({ content: 'There are no ongoing wars.', ephemeral: true });
        }

        let warList = 'Ongoing Wars:\n';
        wars.forEach((war, index) => {
            warList += `${index + 1}. ${war.clan1} vs ${war.clan2} for ${war.pointsForWin} points\n`;
        });

        await interaction.reply({ content: warList });
    }

    else if (commandName === 'lb') {
        const sortedClans = Object.entries(clans)
            .sort(([, a], [, b]) => {
                const balanceA = a.members.reduce((sum, memberId) => sum + (users[memberId]?.balance || 0), 0);
                const balanceB = b.members.reduce((sum, memberId) => sum + (users[memberId]?.balance || 0), 0);
                return balanceB - balanceA;
            })
            .map(([clanName]) => clanName);

        if (sortedClans.length === 0) {
            return interaction.reply({ content: 'No clans available to display.', ephemeral: true });
        }

        let leaderboard = 'Clan Leaderboard:\n';
        sortedClans.forEach((clanName, index) => {
            const clan = clans[clanName];
            const totalBalance = clan.members.reduce((sum, memberId) => sum + (users[memberId]?.balance || 0), 0);
            leaderboard += `${index + 1}. ${clanName} - Total Balance: ${totalBalance}\n`;
        });

        await interaction.reply({ content: leaderboard });
    }

    else if (commandName === 'claninfo') {
        const clanName = users[interaction.user.id]?.clan;
        if (!clanName) {
            return interaction.reply({ content: 'You are not in a clan.', ephemeral: true });
        }

        const clan = clans[clanName];
        const leader = client.users.cache.get(clan.leaderId);
        const coleaders = clan.coleaders.map(id => client.users.cache.get(id).username).join(', ') || 'None';
        const membersCount = clan.members.length;

        await interaction.reply({
            content: `
**Clan Information: ${clanName}**
Leader: ${leader.username}
Co-Leaders: ${coleaders}
Member Count: ${membersCount}
        `,
        });
    }

    else if (commandName === 'toss') {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        await interaction.reply({ content: `The coin landed on: ${result}` });
    }

    else if (commandName === 'log') {
        const opponent = interaction.options.getUser('user');

        const clanName = users[interaction.user.id]?.clan;
        if (!clanName) {
            return interaction.reply({ content: 'You are not in a clan.', ephemeral: true });
        }

        const opponentClanName = users[opponent.id]?.clan;
        if (!opponentClanName) {
            return interaction.reply({ content: 'The opponent is not in a clan.', ephemeral: true });
        }

        const war = wars.find(war =>
            (war.clan1 === clanName && war.clan2 === opponentClanName) ||
            (war.clan1 === opponentClanName && war.clan2 === clanName)
        );

        if (!war) {
            return interaction.reply({ content: 'No war found between your clans.', ephemeral: true });
        }

        users[interaction.user.id].balance = (users[interaction.user.id].balance || 0) + war.pointsForWin;
        await interaction.reply({ content: `${interaction.user.username} won against ${opponent.username} and earned ${war.pointsForWin} points!` });
    }

    else if (commandName === 'setbio') {
        const bio = interaction.options.getString('bio');

        const clanName = users[interaction.user.id]?.clan;
        if (!clanName) {
            return interaction.reply({ content: 'You are not in a clan.', ephemeral: true });
        }
        if (clans[clanName].leaderId !== interaction.user.id) {
            return interaction.reply({ content: 'You are not the clan leader.', ephemeral: true });
        }

        clans[clanName].bio = bio;
        await interaction.reply({ content: `Clan bio set to: ${bio}` });
    }

    else if (commandName === 'setavatar') {
        const avatarURL = interaction.options.getString('avatar_url');

        const clanName = users[interaction.user.id]?.clan;
        if (!clanName) {
            return interaction.reply({ content: 'You are not in a clan.', ephemeral: true });
        }
        if (clans[clanName].leaderId !== interaction.user.id) {
            return interaction.reply({ content: 'You are not the clan leader.', ephemeral: true });
        }

        clans[clanName].avatar = avatarURL;
        await interaction.reply({ content: 'Clan avatar updated!' });
    }

    else if (commandName === 'setbanner') {
        const bannerURL = interaction.options.getString('banner_url');

        const clanName = users[interaction.user.id]?.clan;
        if (!clanName) {
            return interaction.reply({ content: 'You are not in a clan.', ephemeral: true });
        }
        if (clans[clanName].leaderId !== interaction.user.id) {
            return interaction.reply({ content: 'You are not the clan leader.', ephemeral: true });
        }

        clans[clanName].banner = bannerURL;
        await interaction.reply({ content: 'Clan banner updated!' });
    }

    else if (commandName === 'kick') {
        const userToKick = interaction.options.getUser('user');

        const clanName = users[interaction.user.id]?.clan;
        if (!clanName) {
            return interaction.reply({ content: 'You are not in a clan.', ephemeral: true });
        }
        if (clans[clanName].leaderId !== interaction.user.id) {
            return interaction.reply({ content: 'You are not the clan leader.', ephemeral: true });
        }

        if (!clans[clanName].members.includes(userToKick.id)) {
            return interaction.reply({ content: 'That user is not in your clan.', ephemeral: true });
        }

        clans[clanName].members = clans[clanName].members.filter(memberId => memberId !== userToKick.id);
        delete users[userToKick.id];

        await interaction.reply({ content: `${userToKick.username} has been kicked from the clan.` });
    }

    else if (commandName === 'eval') {
        if (interaction.user.id !== 'YOUR_USER_ID') {
            return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
        }

        try {
            const code = interaction.options.getString('code');
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            await interaction.reply({ content: evaled.substring(0, 2000), ephemeral: true });
        } catch (err) {
            await interaction.reply({ content: `\`ERROR\` \`\`\`xl\n${err}\n\`\`\``, ephemeral: true });
        }
    }

    else if (commandName === 'changeav') {
        if (interaction.user.id !== 'YOUR_USER_ID') {
            return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
        }

        const avatarURL = interaction.options.getString('avatar_url');

        try {
            await client.user.setAvatar(avatarURL);
            await interaction.reply({ content: 'Bot avatar updated!', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to update bot avatar.', ephemeral: true });
        }
    }

    else if (commandName === 'changebanner') {
        if (interaction.user.id !== 'YOUR_USER_ID') {
            return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
        }

        const bannerURL = interaction.options.getString('banner_url');

        try {
            await interaction.guild.setBanner(bannerURL);
            await interaction.reply({ content: 'Bot banner updated!', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to update bot banner.  Make sure the bot has the MANAGE_GUILD permission and the URL is a valid image.', ephemeral: true });
        }
    }
});

client.login(token);
