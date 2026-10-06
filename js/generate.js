document.addEventListener("DOMContentLoaded", () => {

    console.log("generate.js loaded");


    // ================================================
    // HTML ELEMENTS
    // ================================================

    const form =
        document.getElementById("certificateForm");

    const companyName =
        document.getElementById("companyName");

    const companyEmail =
        document.getElementById("companyEmail");

    const companyPhone =
        document.getElementById("companyPhone");

    const companyWebsite =
        document.getElementById("companyWebsite");

    const companyAddress =
        document.getElementById("companyAddress");

    const companyLogo =
        document.getElementById("companyLogo");


    const studentName =
        document.getElementById("studentName");

    const studentEmail =
        document.getElementById("studentEmail");

    const studentPhone =
        document.getElementById("studentPhone");

    const studentAddress =
        document.getElementById("studentAddress");


    const internshipRole =
        document.getElementById("internshipRole");

    const internshipStartDate =
        document.getElementById("internshipStartDate");

    const internshipEndDate =
        document.getElementById("internshipEndDate");


    const generateButton =
        document.getElementById("generateButton");


    const formMessage =
        document.getElementById("formMessage");


    const logoPreview =
        document.getElementById("logoPreview");

    const logoPreviewContainer =
        document.getElementById(
            "logoPreviewContainer"
        );


    // ================================================
    // CHECK REQUIRED ELEMENTS
    // ================================================

    if (!form) {

        console.error(
            "certificateForm not found"
        );

        return;
    }


    if (!generateButton) {

        console.error(
            "generateButton not found"
        );

        return;
    }


    // ================================================
    // SHOW MESSAGE
    // ================================================

    function showMessage(
        message,
        type = "error"
    ) {

        if (!formMessage) {
            return;
        }


        formMessage.textContent =
            message;

        formMessage.style.display =
            "block";

        formMessage.className =
            `form-message ${type}`;
    }


    // ================================================
    // HIDE MESSAGE
    // ================================================

    function hideMessage() {

        if (!formMessage) {
            return;
        }


        formMessage.textContent =
            "";

        formMessage.style.display =
            "none";
    }


    // ================================================
    // LOGO PREVIEW
    // ================================================

    if (companyLogo) {

        companyLogo.addEventListener(
            "change",
            () => {

                const file =
                    companyLogo.files[0];


                if (!file) {

                    if (logoPreview) {
                        logoPreview.src = "";
                    }

                    if (logoPreviewContainer) {
                        logoPreviewContainer.style.display =
                            "none";
                    }

                    return;
                }


                const allowedTypes = [
                    "image/png",
                    "image/jpeg",
                    "image/webp"
                ];


                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {

                    alert(
                        "Please select PNG, JPG or WEBP."
                    );

                    companyLogo.value =
                        "";

                    if (logoPreview) {
                        logoPreview.src = "";
                    }

                    if (logoPreviewContainer) {
                        logoPreviewContainer.style.display =
                            "none";
                    }

                    return;
                }


                const maxSize =
                    2 * 1024 * 1024;


                if (file.size > maxSize) {

                    alert(
                        "Logo must be smaller than 2 MB."
                    );

                    companyLogo.value =
                        "";

                    if (logoPreview) {
                        logoPreview.src = "";
                    }

                    if (logoPreviewContainer) {
                        logoPreviewContainer.style.display =
                            "none";
                    }

                    return;
                }


                const imageUrl =
                    URL.createObjectURL(file);


                if (logoPreview) {

                    logoPreview.src =
                        imageUrl;
                }


                if (logoPreviewContainer) {

                    logoPreviewContainer.style.display =
                        "block";
                }

            }
        );
    }


    // ================================================
    // GENERATE CERTIFICATE ID
    // ================================================

    function generateCertificateId() {

        const date =
            new Date();


        const datePart =
            date.getFullYear().toString() +

            String(
                date.getMonth() + 1
            ).padStart(2, "0") +

            String(
                date.getDate()
            ).padStart(2, "0");


        const randomPart =
            crypto
                .randomUUID()
                .replaceAll("-", "")
                .substring(0, 8)
                .toUpperCase();


        return (
            `CERT-${datePart}-${randomPart}`
        );
    }


    // ================================================
    // FORM SUBMIT
    // ================================================

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            hideMessage();


            generateButton.disabled =
                true;

            generateButton.textContent =
                "Generating Certificate...";


            try {

                // ========================================
                // GET FORM VALUES
                // ========================================

                const companyNameValue =
                    companyName.value.trim();


                const companyEmailValue =
                    companyEmail.value.trim();


                const companyPhoneValue =
                    companyPhone.value.trim();


                const companyWebsiteValue =
                    companyWebsite.value.trim();


                const companyAddressValue =
                    companyAddress.value.trim();


                const studentNameValue =
                    studentName.value.trim();


                const studentEmailValue =
                    studentEmail.value.trim();


                const studentPhoneValue =
                    studentPhone.value.trim();


                const studentAddressValue =
                    studentAddress.value.trim();


                const internshipRoleValue =
                    internshipRole.value.trim();


                const startDateValue =
                    internshipStartDate.value;


                const endDateValue =
                    internshipEndDate.value;


                // ========================================
                // VALIDATION
                // ========================================

                if (!companyNameValue) {

                    throw new Error(
                        "Company name is required."
                    );
                }


                if (!studentNameValue) {

                    throw new Error(
                        "Intern name is required."
                    );
                }


                if (!studentEmailValue) {

                    throw new Error(
                        "Intern email is required."
                    );
                }


                if (!internshipRoleValue) {

                    throw new Error(
                        "Internship role is required."
                    );
                }


                if (!startDateValue) {

                    throw new Error(
                        "Start date is required."
                    );
                }


                if (!endDateValue) {

                    throw new Error(
                        "End date is required."
                    );
                }


                if (
                    endDateValue <
                    startDateValue
                ) {

                    throw new Error(
                        "Internship end date cannot be before start date."
                    );
                }


                // ========================================
                // LOGO VALIDATION
                // ========================================

                const logoFile =
                    companyLogo.files[0];


                if (!logoFile) {

                    throw new Error(
                        "Please select a company logo."
                    );
                }


                const allowedTypes = [
                    "image/png",
                    "image/jpeg",
                    "image/webp"
                ];


                if (
                    !allowedTypes.includes(
                        logoFile.type
                    )
                ) {

                    throw new Error(
                        "Logo must be PNG, JPG or WEBP."
                    );
                }


                const maxSize =
                    2 * 1024 * 1024;


                if (
                    logoFile.size >
                    maxSize
                ) {

                    throw new Error(
                        "Logo must be smaller than 2 MB."
                    );
                }


                // ========================================
                // INITIALIZE SUPABASE
                // ========================================

                console.log(
                    "Loading Supabase configuration..."
                );


                const supabaseClient =
                    await initializeSupabase();


                console.log(
                    "Supabase client ready."
                );


                // ========================================
                // 1. CREATE COMPANY
                // ========================================

                console.log(
                    "Creating company..."
                );


                const {
                    data: company,
                    error: companyError
                } =
                    await supabaseClient

                        .from("companies")

                        .insert({

                            name:
                                companyNameValue,

                            address:
                                companyAddressValue,

                            email:
                                companyEmailValue,

                            website:
                                companyWebsiteValue,

                            phone:
                                companyPhoneValue

                        })

                        .select()

                        .single();


                if (companyError) {

                    console.error(
                        "Company error:",
                        companyError
                    );


                    throw new Error(
                        "Company creation failed: " +
                        companyError.message
                    );
                }


                console.log(
                    "Company created:",
                    company
                );


                const companyId =
                    company.id;


                // ========================================
                // 2. UPLOAD COMPANY LOGO
                // ========================================

                console.log(
                    "Uploading company logo..."
                );


                const extension =
                    logoFile.name
                        .split(".")
                        .pop()
                        .toLowerCase();


                const filePath =
                    `companies/${companyId}/logo.${extension}`;


                const {
                    data: uploadData,
                    error: uploadError
                } =
                    await supabaseClient

                        .storage

                        .from(
                            "company-logos"
                        )

                        .upload(
                            filePath,
                            logoFile,
                            {
                                cacheControl:
                                    "3600",

                                upsert:
                                    false,

                                contentType:
                                    logoFile.type
                            }
                        );


                if (uploadError) {

                    console.error(
                        "Upload error:",
                        uploadError
                    );


                    throw new Error(
                        "Logo upload failed: " +
                        uploadError.message
                    );
                }


                console.log(
                    "Logo uploaded:",
                    uploadData
                );


                // ========================================
                // 3. GET PUBLIC LOGO URL
                // ========================================

                const {
                    data: publicUrlData
                } =
                    supabaseClient

                        .storage

                        .from(
                            "company-logos"
                        )

                        .getPublicUrl(
                            filePath
                        );


                const logoUrl =
                    publicUrlData.publicUrl;


                console.log(
                    "Logo URL:",
                    logoUrl
                );


                // ========================================
                // 4. UPDATE COMPANY LOGO URL
                // ========================================

                const {
                    error: updateError
                } =
                    await supabaseClient

                        .from("companies")

                        .update({

                            logo_url:
                                logoUrl

                        })

                        .eq(
                            "id",
                            companyId
                        );


                if (updateError) {

                    console.error(
                        "Update error:",
                        updateError
                    );


                    throw new Error(
                        "Could not save logo URL: " +
                        updateError.message
                    );
                }


                // ========================================
                // 5. GENERATE CERTIFICATE ID
                // ========================================

                const certificateId =
                    generateCertificateId();


                console.log(
                    "Certificate ID:",
                    certificateId
                );


                // ========================================
                // 6. VERIFICATION URL
                // ========================================

                const verificationUrl =
                    `${window.location.origin}/verify.html?id=${encodeURIComponent(
                        certificateId
                    )}`;


                console.log(
                    "Verification URL:",
                    verificationUrl
                );


                // ========================================
                // 7. CREATE CERTIFICATE
                // ========================================

                console.log(
                    "Creating certificate..."
                );


                const {
                    data: certificate,
                    error: certificateError
                } =
                    await supabaseClient

                        .from("certificates")

                        .insert({

                            certificate_id:
                                certificateId,

                            student_name:
                                studentNameValue,

                            student_email:
                                studentEmailValue,

                            student_phone:
                                studentPhoneValue,

                            student_address:
                                studentAddressValue,

                            internship_role:
                                internshipRoleValue,

                            internship_start_date:
                                startDateValue,

                            internship_end_date:
                                endDateValue,

                            company_id:
                                companyId,

                            certificate_status:
                                "valid",

                            verification_url:
                                verificationUrl

                        })

                        .select()

                        .single();


                if (certificateError) {

                    console.error(
                        "Certificate error:",
                        certificateError
                    );


                    throw new Error(
                        "Certificate creation failed: " +
                        certificateError.message
                    );
                }


                console.log(
                    "Certificate created:",
                    certificate
                );


                // ========================================
                // 8. SAVE DATA FOR CERTIFICATE PAGE
                // ========================================

                const certificateData = {

                    certificateId:

                        certificateId,


                    studentName:

                        studentNameValue,


                    studentEmail:

                        studentEmailValue,


                    studentPhone:

                        studentPhoneValue,


                    studentAddress:

                        studentAddressValue,


                    internshipRole:

                        internshipRoleValue,


                    internshipStartDate:

                        startDateValue,


                    internshipEndDate:

                        endDateValue,


                    companyId:

                        companyId,


                    companyName:

                        companyNameValue,


                    companyEmail:

                        companyEmailValue,


                    companyPhone:

                        companyPhoneValue,


                    companyWebsite:

                        companyWebsiteValue,


                    companyAddress:

                        companyAddressValue,


                    logoUrl:

                        logoUrl,


                    verificationUrl:

                        verificationUrl

                };


                sessionStorage.setItem(
                    "certificateData",
                    JSON.stringify(
                        certificateData
                    )
                );


                // ========================================
                // 9. REDIRECT
                // ========================================

                console.log(
                    "Certificate generated successfully."
                );


                window.location.href =
                    "certificate.html";


            } catch (error) {

                console.error(
                    "Generation error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Something went wrong.",
                    "error"
                );


                generateButton.disabled =
                    false;

                generateButton.textContent =
                    "Generate Certificate";
            }

        }
    );

});