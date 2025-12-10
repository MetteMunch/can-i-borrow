//Denne bruges til GET requests
export async function fetchGet(url) {

    try {
        const response = await fetch(url, {
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

//Denne bruges til POST, PUT, DELETE requests
export async function fetchRequestJson(url, bodyObjekt, httpVerbum) {

    const objectAsJsonString = JSON.stringify(bodyObjekt); //stringify konverterer vores objekt til en JSON-streng
    const fetchOptions = { //Her definerer vi et objekt "fetchOptions" som beskriver hvordan vi vil sende data
        method: httpVerbum,
        credentials: "include",
        headers: {
            "Content-Type": "application/json", //Vi fortæller serveren, at vi sender JSON
        },
        body: objectAsJsonString, //Det er vores objekt konverteret til en JSON-streng som vi sender som data (i body) eller empty body med {}
    };

    const response = await fetch(url, fetchOptions); //HTTP-request sendes med fetch til den angivne url.
    //fetch returnerer et promise til et starte med, men await gør at vi venter på korrekt svar (response)

    if (!response.ok) {
        const errorMessage = response.statusText;
        console.error("Dette er fejl i postObjectAsData", errorMessage); //Hvis serveren returnerer med en fejl, henter vi denne fejlbesked og udskriver den i konsollen
        console.log("Dette er fejl i postObjectAsData", errorMessage); //Hvis serveren returnerer med en fejl, henter vi denne fejlbesked og udskriver den i konsollen
    }
    return response
}

