exports.handler = async function () {

    return {
        statusCode: 200,

        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store"
        },

        body: JSON.stringify({
            supabaseUrl:
                process.env.SUPABASE_URL,

            supabasePublishableKey:
                process.env.SUPABASE_PUBLISHABLE_KEY
        })
    };
};