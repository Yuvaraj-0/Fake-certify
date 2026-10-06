document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // GET CERTIFICATE DATA
    // ==================================================

    const rawData =
        sessionStorage.getItem("certificateData");


    if (!rawData) {

        alert("Certificate data not found.");

        window.location.href =
            "generate.html";

        return;
    }


    let data;


    try {

        data = JSON.parse(rawData);

    } catch (error) {

        console.error(
            "Invalid certificate data:",
            error
        );

        alert("Invalid certificate data.");

        return;
    }


    console.log(
        "Certificate data:",
        data
    );


    // ==================================================
    // COMPANY
    // ==================================================

    setText(
        "companyName",
        data.companyName
    );


    setText(
        "companyAddress",
        data.companyAddress
    );


    setText(
        "companyPhone",
        data.companyPhone
    );


    setText(
        "companyEmail",
        data.companyEmail
    );


    // ==================================================
    // COMPANY LOGO
    // ==================================================

    const logo =
        document.getElementById(
            "companyLogo"
        );


    if (
        logo &&
        data.logoUrl
    ) {

        logo.src =
            data.logoUrl;

        logo.style.display =
            "block";
    }


    // ==================================================
    // STUDENT
    // ==================================================

    setText(
        "studentName",
        data.studentName
    );


    // ==================================================
    // INTERNSHIP
    // ==================================================

    setText(
        "internshipRole",
        data.internshipRole
    );


    // ==================================================
    // INTERNSHIP PERIOD
    // ==================================================

    const startDate =
        formatDate(
            data.internshipStartDate
        );


    const endDate =
        formatDate(
            data.internshipEndDate
        );


    setText(
        "internshipPeriod",
        `${startDate} - ${endDate}`
    );


    // ==================================================
    // CERTIFICATE ID
    // ==================================================

    setText(
        "certificateId",
        data.certificateId
    );


    // ==================================================
    // QR CODE
    // ==================================================

    generateQRCode(
        data.verificationUrl
    );

});


// ==================================================
// SET TEXT
// ==================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) {

        console.warn(
            `Element #${id} not found`
        );

        return;
    }


    element.textContent =
        value || "-";
}


// ==================================================
// FORMAT DATE
// ==================================================

function formatDate(
    dateString
) {

    if (!dateString) {

        return "-";
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}

function generateQRCode(verificationUrl) {

    const qrContainer =
        document.getElementById("qrcode");

    if (!qrContainer) {
        return;
    }

    if (!verificationUrl) {
        console.warn("Verification URL not found.");
        return;
    }

    console.log("QR URL:", verificationUrl);

    qrContainer.innerHTML = "";

    new QRCode(qrContainer, {
        text: verificationUrl,
        width: 120,
        height: 120,
        correctLevel: QRCode.CorrectLevel.H
    });
}