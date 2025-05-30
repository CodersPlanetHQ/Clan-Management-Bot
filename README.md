# Discord Clan Bot

This is a Discord bot designed to manage clans, wars, and user profiles within a Discord server. It's built using discord.js v14 and utilizes slash commands for user interaction.

## Features

*   **Clan Management:**
    *   Create clans (admin/owner only)
    *   Add co-leaders (leader only)
    *   Invite users to clans (leader/co-leader only)
    *   Accept/Decline clan invitations
    *   Kick members (leader only)
    *   Set clan bio, avatar, and banner (leader only)
*   **War System:**
    *   Start wars between clans
    *   Log wins against other users
    *   View ongoing wars
*   **User Profiles:**
    *   View clan profiles
    *   Display user balance
*   **Leaderboard:**
    *   Display clan leaderboard based on total member balance
*   **Utility Commands:**
    *   Coin toss
*   **Admin/Owner Commands:**
    *   Evaluate JavaScript code (owner only - **VERY DANGEROUS**)
    *   Change bot avatar and banner (owner only)

## Prerequisites

*   Node.js (v16 or higher)
*   npm (Node Package Manager)
*   A Discord bot token
*   A Discord server with appropriate permissions for the bot

## Setup

1.  **Install Dependencies:**

    ```bash
    npm install discord.js @discordjs/rest
    ```

2.  **Configure the Bot:**

    *   Rename the file to `index.js`
    *   Replace the following placeholders in `index.js` with your actual values:
        *   `YOUR_BOT_TOKEN`: Your Discord bot token.
        *   `YOUR_CLIENT_ID`: Your Discord application client ID.
        *   `YOUR_GUILD_ID`: The ID of the Discord server where you want to use the bot.
        *   `YOUR_USER_ID`: Your Discord user ID (for owner-only commands).

3.  **Register Slash Commands:**

    The bot uses slash commands. After inviting the bot to your server, you need to register these commands. The provided code automatically registers the commands when the bot starts.

4.  **Run the Bot:**

    ```bash
    node index.js
    ```

## Usage

Once the bot is running, you can use the slash commands in your Discord server. Type `/` in the chat to see a list of available commands.

## Important Notes

*   **In-Memory Data Storage:** This bot uses in-memory data storage, meaning all data (clans, users, wars) will be lost when the bot restarts. For a production bot, you **MUST** use a persistent database (e.g., MongoDB, SQLite).
*   **`eval` Command:** The `eval` command is extremely dangerous and should only be used by the bot owner with extreme caution. It allows executing arbitrary JavaScript code, which can lead to security vulnerabilities if misused.
*   **Permissions:** Ensure the bot has the necessary permissions in your Discord server to function correctly (e.g., read messages, send messages, manage roles).
*   **Error Handling:** The code includes basic error handling, but you should implement more robust error handling for a production bot.
*   **Rate Limiting:** Implement rate limiting to prevent abuse of the bot's commands.

## Contributing

Contributions are welcome! Feel free to submit pull requests with bug fixes, new features, or improvements to the documentation.

## License

This project is licensed under the [MIT License](LICENSE).
