const env = process.env;

const tournamentID = env.API_tourney;
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