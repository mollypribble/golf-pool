const env = process.env;

const tournamentID = env.API_tourney;//"79b00955-02a9-44d5-9b77-a5b32931914e"; // "0a4373fe-a2b9-4a9d-ad84-d342dea6b61a" //US Open 2021 
const key = env.API_key;
const api_URL = "http://api.sportradar.us/golf/trial/pga/v3/en/2020/tournaments/"+ tournamentID + "/leaderboard.json?api_key=" + key;

const dbConfig = {
    database: `mongodb+srv://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_HOST}/${env.DB_NAME}?retryWrites=true&w=majority`,
    host: "http://localhost",
    mongoConfig: {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    apiURL: api_URL
};

module.exports = dbConfig;
