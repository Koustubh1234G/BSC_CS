// Fetch JSON data from Google Drive
// files
// const dbms = "dbms.json";
const cpp = "cpp.json";
fetch(cpp)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Handle JSON data
    // console.log(data);
    load_Question(data);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    alert("There is some froblem fetching data, try ask Koustubh.\nThank You");
  });

// Get the first element with class "questions"
const questionsContainer = document.querySelector(".questions");

function load_Question(data) {
    const questions = data.questions;
    questions.forEach(e => {
        // creates div
        const container = document.createElement("div");
        const questiondiv = document.createElement("div");
        // add classes to div
        container.classList.add("pair-container");
        questiondiv.classList.add("question");
        
        // set values for them
        questiondiv.innerHTML = marked.parse(e.question);

        container.appendChild(questiondiv);
        questionsContainer.appendChild(container);
        
        // add click event listener to each question to toggle answer visibility
        container.addEventListener("click", function() {
            // answerdiv.classList.toggle("visible");
            show_card(e, questionsContainer, data);
        });
    });
}

function show_card(e, questionsContainer, data) {
    // card
    const carddiv = document.createElement("div");
    carddiv.classList.add("card");
    
    // question
    const questiondiv = document.createElement("div");
    questiondiv.classList.add("question");
    questiondiv.innerHTML = marked.parse(e.question);

    // answer
    const answerdiv = document.createElement("div");
    answerdiv.classList.add("answer");
    answerdiv.innerHTML = marked.parse(e.answer);
    mermaid.initialize({
        startOnLoad: true
    });

    // back btn
    const backBtn = document.createElement("button");
    backBtn.classList.add("btn");
    backBtn.innerText = "<-- back";   
    
    // just show question and ans on card
    carddiv.appendChild(backBtn);
    carddiv.appendChild(questiondiv);
    carddiv.appendChild(answerdiv);
    
    // graph
    // check for graph in json block
    if (e.graph) {
        // If the answer contains a "graph" element, render the Mermaid diagram
        const mermaidDiv = document.createElement("div");
        mermaidDiv.classList.add("mermaid");
        mermaidDiv.innerHTML = e.graph.innerText;
        carddiv.appendChild(mermaidDiv);
        // Initialize the Mermaid library and render the graph
        mermaid.initialize({startOnLoad:false});
        // Wait for the Mermaid library to load before rendering the graph
        setTimeout(() => {
            mermaid.render('graphDiv', e.graph.innerText, function(svgCode) {
                // Replace the Mermaid div with the SVG code
                mermaidDiv.innerHTML = svgCode;
            });
        }, 0);
    }

    // just show card on q container
    questionsContainer.innerHTML = "";
    questionsContainer.appendChild(carddiv);

    backBtn.addEventListener("click", () => {
        questionsContainer.innerHTML = "";
        load_Question(data);
    });

}

// form 
// Check if the user has already submitted the form
if (localStorage.getItem('formSubmitted-cpp')) {
    // If the form has already been submitted, disable the form
    document.getElementById('submissionForm').style.display = 'none';
    load_Question();
} else {
    // If the form has not been submitted, enable form submission
    document.getElementById('submissionForm').addEventListener('submit', function () {
        // Set a flag in local storage indicating that the form has been submitted
        localStorage.setItem('formSubmitted-cpp', true);
        load_Question();
    });
}

// Function to get the user's IP address
function getIPAddress(callback) {
    // Use a third-party service to fetch the user's IP address
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ipAddress = data.ip;
            // Call the callback function with the IP address
            callback(ipAddress);
        })
        .catch(error => {
            console.error('Error:', error);
            // Call the callback function with a default value (e.g., empty string)
            callback('');
        });
}

// Function to set the value of the IP address field in the form
function setIPAddress(ipAddress) {
    // Find the IP address field in the form
    const ipField = document.querySelector('input[name="_ip"]');
    // Set the value of the IP address field
    if (ipField) {
        ipField.value = ipAddress;
    }
}

// Call the function to get the user's IP address and set it in the form
getIPAddress(setIPAddress);