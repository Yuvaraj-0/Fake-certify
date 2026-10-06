let supabaseClient = null;


async function initializeSupabase() {

    if (supabaseClient) {

        return supabaseClient;
    }


    const response =
        await fetch(
            "/.netlify/functions/config"
        );


    if (!response.ok) {

        throw new Error(
            "Unable to load Supabase configuration."
        );
    }


    const config =
        await response.json();


    if (
        !config.supabaseUrl ||
        !config.supabasePublishableKey
    ) {

        throw new Error(
            "Supabase configuration is missing."
        );
    }


    supabaseClient =
        supabase.createClient(
            config.supabaseUrl,
            config.supabasePublishableKey
        );


    return supabaseClient;
}