
let verifyForm = null;

let certificateIdInput = null;

let verifyMessage = null;

let certificateResult = null;


// ==================================================
// PAGE LOAD
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "verify.js loaded"
        );


        // ==============================================
        // GET HTML ELEMENTS
        // ==============================================

        verifyForm =
            document.getElementById(
                "verifyForm"
            );


        certificateIdInput =
            document.getElementById(
                "certificateIdInput"
            );


        verifyMessage =
            document.getElementById(
                "verifyMessage"
            );


        certificateResult =
            document.getElementById(
                "certificateResult"
            );


        // ==============================================
        // CHECK ELEMENTS
        // ==============================================

        if (!verifyForm) {

            console.error(
                "verifyForm not found"
            );

            return;
        }


        if (!certificateIdInput) {

            console.error(
                "certificateIdInput not found"
            );

            return;
        }


        // ==============================================
        // INITIALIZE SUPABASE
        // ==============================================

        try {

            console.log(
                "Loading Supabase configuration..."
            );


            supabaseClient =
                await initializeSupabase();


            console.log(
                "Supabase client ready."
            );


        } catch (error) {

            console.error(
                "Supabase initialization error:",
                error
            );


            if (verifyMessage) {

                verifyMessage.textContent =
                    "Unable to connect to verification service.";
            }


            return;
        }


        // ==============================================
        // GET CERTIFICATE ID FROM URL
        // ==============================================

        const params =
            new URLSearchParams(
                window.location.search
            );


        const urlCertificateId =
            params.get("id");


        if (urlCertificateId) {

            const cleanCertificateId =
                urlCertificateId
                    .trim()
                    .toUpperCase();


            certificateIdInput.value =
                cleanCertificateId;


            await verifyCertificate(
                cleanCertificateId
            );
        }


        // ==============================================
        // FORM SUBMIT
        // ==============================================

        verifyForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const certificateId =
                    certificateIdInput
                        .value
                        .trim()
                        .toUpperCase();


                if (!certificateId) {

                    if (verifyMessage) {

                        verifyMessage.textContent =
                            "Please enter a certificate ID.";
                    }


                    return;
                }


                await verifyCertificate(
                    certificateId
                );

            }
        );

    }
);


// ==================================================
// VERIFY CERTIFICATE
// ==================================================

async function verifyCertificate(
    certificateId
) {

    if (!supabaseClient) {

        console.error(
            "Supabase client not initialized."
        );

        return;
    }


    if (verifyMessage) {

        verifyMessage.textContent =
            "Verifying certificate...";
    }


    if (certificateResult) {

        certificateResult.innerHTML =
            "";
    }


    try {

        // ==============================================
        // QUERY CERTIFICATE
        // ==============================================

        const {
            data,
            error
        } =
            await supabaseClient

                .from("certificates")

                .select(`
                    certificate_id,
                    student_name,
                    internship_role,
                    internship_start_date,
                    internship_end_date,
                    certificate_status,
                    verification_url,
                    companies (
                        name,
                        address,
                        email,
                        website,
                        phone,
                        logo_url
                    )
                `)

                .eq(
                    "certificate_id",
                    certificateId
                )

                .maybeSingle();


        if (error) {

            throw error;
        }


        // ==============================================
        // NOT FOUND
        // ==============================================

        if (!data) {

            if (verifyMessage) {

                verifyMessage.textContent =
                    "";
            }


            if (certificateResult) {

                certificateResult.innerHTML = `

                    <div class="invalid-result">

                        <h2>
                            ✕ Certificate Not Found
                        </h2>

                        <p>
                            The certificate ID
                            <strong>
                                ${escapeHTML(
                                    certificateId
                                )}
                            </strong>
                            could not be found.
                        </p>

                        <p>
                            This certificate may be
                            invalid or the ID may have
                            been entered incorrectly.
                        </p>

                    </div>

                `;
            }


            return;
        }


        // ==============================================
        // INVALID STATUS
        // ==============================================

        if (
            data.certificate_status !==
            "valid"
        ) {

            if (verifyMessage) {

                verifyMessage.textContent =
                    "";
            }


            if (certificateResult) {

                certificateResult.innerHTML = `

                    <div class="invalid-result">

                        <h2>
                            ⚠ Certificate Invalid
                        </h2>

                        <p>
                            This certificate has been
                            marked as invalid.
                        </p>

                    </div>

                `;
            }


            return;
        }


        // ==============================================
        // COMPANY
        // ==============================================

        const company =
            data.companies;


        // ==============================================
        // DATES
        // ==============================================

        const startDate =
            formatDate(
                data.internship_start_date
            );


        const endDate =
            formatDate(
                data.internship_end_date
            );


        // ==============================================
        // SUCCESS
        // ==============================================

        if (verifyMessage) {

            verifyMessage.textContent =
                "✓ Certificate successfully verified";
        }


        if (certificateResult) {

            certificateResult.innerHTML = `

                <div class="valid-result">

                    ${
                        company &&
                        company.logo_url
                            ? `
                                <img
                                    src="${escapeHTML(
                                        company.logo_url
                                    )}"
                                    class="company-logo"
                                    alt="Company Logo"
                                >
                              `
                            : ""
                    }


                    <h2>
                        ✓ Certificate Verified
                    </h2>


                    <p>
                        This certificate is authentic
                        and was issued by the company
                        shown below.
                    </p>


                    <div class="result-row">

                        <span>
                            CERTIFICATE ID
                        </span>

                        <strong>
                            ${escapeHTML(
                                data.certificate_id
                            )}
                        </strong>

                    </div>


                    <div class="result-row">

                        <span>
                            INTERN
                        </span>

                        <strong>
                            ${escapeHTML(
                                data.student_name
                            )}
                        </strong>

                    </div>


                    <div class="result-row">

                        <span>
                            INTERNSHIP ROLE
                        </span>

                        <strong>
                            ${escapeHTML(
                                data.internship_role
                            )}
                        </strong>

                    </div>


                    <div class="result-row">

                        <span>
                            COMPANY
                        </span>

                        <strong>
                            ${escapeHTML(
                                company?.name || "-"
                            )}
                        </strong>

                    </div>


                    <div class="result-row">

                        <span>
                            INTERNSHIP PERIOD
                        </span>

                        <strong>
                            ${startDate}
                            -
                            ${endDate}
                        </strong>

                    </div>


                    ${
                        company?.address
                            ? `
                                <div class="result-row">

                                    <span>
                                        ADDRESS
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            company.address
                                        )}
                                    </strong>

                                </div>
                              `
                            : ""
                    }


                    ${
                        company?.email
                            ? `
                                <div class="result-row">

                                    <span>
                                        EMAIL
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            company.email
                                        )}
                                    </strong>

                                </div>
                              `
                            : ""
                    }


                    ${
                        company?.phone
                            ? `
                                <div class="result-row">

                                    <span>
                                        PHONE
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            company.phone
                                        )}
                                    </strong>

                                </div>
                              `
                            : ""
                    }

                </div>

            `;
        }


    } catch (error) {

        console.error(
            "Verification error:",
            error
        );


        if (verifyMessage) {

            verifyMessage.textContent =
                "Unable to verify certificate.";
        }


        if (certificateResult) {

            certificateResult.innerHTML = `

                <div class="invalid-result">

                    <h2>
                        Verification Error
                    </h2>

                    <p>
                        Something went wrong while
                        checking the certificate.
                    </p>

                </div>

            `;
        }
    }
}


// ==================================================
// DATE FORMAT
// ==================================================

function formatDate(
    dateString
) {

    if (!dateString) {

        return "-";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;
    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ==================================================
// HTML ESCAPE
// ==================================================

function escapeHTML(
    value
) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}