// Constituency data with candidates and voters
const constituencyData = {
    "Guntur East": {
        candidates: [
            { name: "Candidate 1", party: "Party A", logo: "party_a_logo.png", votes: 0, photo: "candidate_1.jpg" },
            { name: "Candidate 2", party: "Party B", logo: "party_b_logo.png", votes: 0, photo: "candidate_2.jpg" },
            { name: "Candidate 3", party: "Party C", logo: "party_c_logo.png", votes: 0, photo: "candidate_3.jpg" }
        ],
        voters: [
            { voterId: "VOTER1234", hasVoted: false },
            { voterId: "VOTER5678", hasVoted: false },
            { voterId: "VOTER91011", hasVoted: false }
        ]
    }
    // Add other constituencies here...
};

// Admin credentials for login
const adminCredentials = {
    adminId: "admin123",
    password: "adminpass"
};

// Admin login validation
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const adminId = document.getElementById("adminId").value;
    const password = document.getElementById("password").value;

    // Validate Admin login
    if (adminId === adminCredentials.adminId && password === adminCredentials.password) {
        alert("Login successful!");
        window.location.href = "voter-validation.html";
    } else {
        alert("Invalid Admin Credentials. Please try again.");
    }
});

// Get the selected constituency from localStorage
const selectedConstituency = localStorage.getItem("constituency") || "Guntur East"; // Default constituency

// Function to validate Voter ID and check if they have voted
function isValidVoter(voterId, constituency) {
    const voters = constituencyData[constituency]?.voters || [];
    const voter = voters.find(voter => voter.voterId === voterId);
    return voter && !voter.hasVoted; // Returns true if voter is valid and hasn't voted
}

// Handle voter validation form submission
document.getElementById("voterForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const voterId = document.getElementById("voterId").value;

    // Check if the voter is valid
    if (isValidVoter(voterId, selectedConstituency)) {
        showConfirmationModal(voterId);
    } else {
        alert("Invalid Voter ID or Voter has already voted.");
    }
});

// Show a confirmation modal after voter validation
function showConfirmationModal(voterId) {
    const modal = document.getElementById("confirmationModal");
    const modalBody = document.getElementById("modalBody");
    const modalTitle = document.getElementById("modalTitle");

    // Set modal content
    modalTitle.textContent = `Voter ID: ${voterId} Validated`;
    modalBody.textContent = `You have been validated for the constituency: ${selectedConstituency}. Click OK to proceed with voting.`;

    // Show the modal
    modal.style.display = "block";

    // When the user clicks OK, load the candidates for the selected constituency
    document.getElementById("modalOkButton").onclick = function () {
        modal.style.display = "none"; // Hide the modal
        loadCandidatesForConstituency(selectedConstituency); // Load the candidate list
    };

    // Handle modal close button
    document.getElementById("modalCloseButton").onclick = function () {
        modal.style.display = "none";
    };
}

// Load candidates for the selected constituency
function loadCandidatesForConstituency(constituency) {
    const candidates = constituencyData[constituency]?.candidates || [];
    const tableBody = document.getElementById("candidateTableBody");

    tableBody.innerHTML = ''; // Clear previous entries

    candidates.forEach((candidate, index) => {
        const row = document.createElement("tr");

        const candidateName = `<td><img src="${candidate.photo}" alt="${candidate.name}" width="50"> ${candidate.name}</td>`;
        const partyInfo = `<td><img src="${candidate.logo}" alt="${candidate.party}" width="50"> ${candidate.party}</td>`;
        const voteButton = `<td><button class="btn btn-success" onclick="castVote(${index}, '${constituency}')">Vote</button></td>`;

        row.innerHTML = candidateName + partyInfo + voteButton;
        tableBody.appendChild(row);
    });

    // Show the candidate list table
    document.getElementById("candidateList").style.display = "block";
}

// Cast a vote for a candidate
function castVote(candidateIndex, constituency) {
    const candidates = constituencyData[constituency].candidates;
    const voters = constituencyData[constituency].voters;

    const voterId = document.getElementById("voterId").value;
    const voter = voters.find(voter => voter.voterId === voterId);

    if (voter && !voter.hasVoted) {
        voter.hasVoted = true; // Mark voter as having voted
        candidates[candidateIndex].votes++; // Increment vote for the selected candidate

        alert("Your vote has been cast successfully!");

        // Optionally, redirect or display confirmation page
        window.location.href = "index.html"; // Redirect back to home page
    } else {
        alert("You have already voted or invalid voter ID.");
    }
}