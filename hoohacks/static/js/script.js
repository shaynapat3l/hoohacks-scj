document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("questionnaire").addEventListener("submit", async (e) => {
        e.preventDefault();

        const user_data = {
            state: document.getElementById("state").value,
            city: document.getElementById("city").value
        };

        try {
            const response = await fetch("/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user_data),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const recommendations = await response.json();
            console.log("Recommendations:", recommendations);

            const resultsDiv = document.getElementById("recommendations-output");
            resultsDiv.innerHTML = "";

       
            if (recommendations.ai_recommendations) {
                const aiSection = document.createElement("div");
                aiSection.innerHTML = `<h3>AI Recommendations</h3>`;

                if (Array.isArray(recommendations.ai_recommendations)) {
                    const aiList = document.createElement("ul");
                    recommendations.ai_recommendations.forEach((rec) => {
                        const listItem = document.createElement("li");
                        listItem.textContent = rec;
                        aiList.appendChild(listItem);
                    });
                    aiSection.appendChild(aiList);
                } else {
                    aiSection.innerHTML += `<p>${recommendations.ai_recommendations}</p>`;
                }

                resultsDiv.appendChild(aiSection);
            }


            if (recommendations.realtor_data && recommendations.realtor_data.listings) {
                const realEstateSection = document.createElement("div");
                realEstateSection.innerHTML = `<h3>Planned Parenthood Locations</h3>`;

                recommendations.realtor_data.listings.forEach((listing) => {
                    const listingDiv = document.createElement("div");
                    listingDiv.classList.add("listing");
                    listingDiv.innerHTML = `
                        <p><strong>Address:</strong> ${listing.address}</p>
                        <p><strong>Price:</strong> $${listing.list_price}</p>
                        <p><strong>Beds:</strong> ${listing.beds}, <strong>Baths:</strong> ${listing.baths}, <strong>Sqft:</strong> ${listing.sqft}</p>
                        <hr>
                    `;
                    realEstateSection.appendChild(listingDiv);
                });

                resultsDiv.appendChild(realEstateSection);
            }

 
            if (recommendations.teleport_data) {
                const teleportSection = document.createElement("div");
                teleportSection.innerHTML = `
                    <h3>Cost of Living & Crime Rates</h3>
                    <p><strong>Cost of Living:</strong> ${recommendations.teleport_data.categories[0].score_out_of_10}/10</p>
                    <p><strong>Crime Rate:</strong> ${recommendations.teleport_data.categories[1].score_out_of_10}/10</p>
                `;
                resultsDiv.appendChild(teleportSection);
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            document.getElementById("recommendations-output").innerHTML = `<p style="color:red;">Error fetching recommendations. Check console for details.</p>`;
        }
    });
});
