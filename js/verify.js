const verifyForm =
    document.getElementById("verifyForm");

const certificateIdInput =
    document.getElementById(
        "certificateIdInput"
    );

const verifyMessage =
    document.getElementById(
        "verifyMessage"
    );

const certificateResult =
    document.getElementById(
        "certificateResult"
    );


// =================================
// GET ID FROM URL
// =================================

const params =
    new URLSearchParams(
        window.location.search
    );

const urlCertificateId =
    params.get("id");


if (urlCertificateId) {

    certificateIdInput.value =
        urlCertificateId;

    verifyCertificate(
        urlCertificateId
    );
}


// =================================
// FORM
// =================================

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

            verifyMessage.textContent =
                "Please enter a certificate ID.";

            return;
        }

        await verifyCertificate(
            certificateId
        );
    }
);


// =================================
// VERIFY
// =================================

async function verifyCertificate(
    certificateId
) {

    verifyMessage.textContent =
        "Verifying certificate...";

    certificateResult.innerHTML =
        "";


    try {

        const { data, error } =
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


        if (!data) {

            verifyMessage.textContent =
                "";

            certificateResult.innerHTML = `

                <div class="invalid-result">

                    <h2>
                        ✕ Certificate Not Found
                    </h2>

                    <p>
                        The certificate ID
                        <strong>
                            ${certificateId}
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

            return;
        }


        if (
            data.certificate_status !==
            "valid"
        ) {

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

            return;
        }


        verifyMessage.textContent =
            "✓ Certificate successfully verified";


        const company =
            data.companies;


        const startDate =
            formatDate(
                data.internship_start_date
            );


        const endDate =
            formatDate(
                data.internship_end_date
            );


        certificateResult.innerHTML = `

            <div class="valid-result">

                <img
                    src="${company.logo_url}"
                    class="company-logo"
                    alt="Company Logo"
                >

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
                        ${data.certificate_id}
                    </strong>

                </div>


                <div class="result-row">

                    <span>
                        INTERN
                    </span>

                    <strong>
                        ${data.student_name}
                    </strong>

                </div>


                <div class="result-row">

                    <span>
                        INTERNSHIP ROLE
                    </span>

                    <strong>
                        ${data.internship_role}
                    </strong>

                </div>


                <div class="result-row">

                    <span>
                        COMPANY
                    </span>

                    <strong>
                        ${company.name}
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

            </div>

        `;


    } catch (error) {

        console.error(
            "Verification error:",
            error
        );

        verifyMessage.textContent =
            "Unable to verify certificate.";

        certificateResult.innerHTML = `

            <div class="invalid-result">

                Something went wrong while
                checking the certificate.

            </div>

        `;
    }
}


// =================================
// DATE FORMAT
// =================================

function formatDate(
    dateString
) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );

    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}