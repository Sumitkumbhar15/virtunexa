document.getElementById('question1').addEventListener('change', function () {
    const conditionalQuestion = document.getElementById('conditionalQuestion');
    const feedbackQuestion = document.getElementById('feedbackQuestion');

    if (this.value === 'yes') {
      conditionalQuestion.classList.remove('hidden');
      feedbackQuestion.classList.add('hidden');
    } else if (this.value === 'no') {
      feedbackQuestion.classList.remove('hidden');
      conditionalQuestion.classList.add('hidden');
    } else {
      conditionalQuestion.classList.add('hidden');
      feedbackQuestion.classList.add('hidden');
    }
  });

  function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const email = document.getElementById('email').value;
    const question1 = document.getElementById('question1').value;
    const favoriteLanguage = document.getElementById('favoriteLanguage').value;
    const experienceLevel = document.getElementById('experienceLevel').value;
    const codingFrequency = document.getElementById('codingFrequency').value;
    const techInterest = document.getElementById('techInterest').value;
    const reason = document.getElementById('reason').value;
    const alternativeInterest = document.getElementById('alternativeInterest').value;
    const challenges = document.getElementById('challenges').value;

    const responses = {
      name,
      age,
      email,
      question1,
      favoriteLanguage,
      experienceLevel,
      codingFrequency,
      techInterest,
      reason,
      alternativeInterest,
      challenges
    };

    // Retrieve existing responses from localStorage or create an empty array
    const existingResponses = JSON.parse(localStorage.getItem('surveyResponses')) || [];
    
    // Append the new response
    existingResponses.push(responses);
    
    // Save the updated responses back to localStorage
    localStorage.setItem('surveyResponses', JSON.stringify(existingResponses));

    displayResponses(existingResponses);
  }

  function handleDeleteResponse(index) {
    const existingResponses = JSON.parse(localStorage.getItem('surveyResponses'));
    existingResponses.splice(index, 1); // Remove the response at the given index

    // Save the updated responses back to localStorage
    localStorage.setItem('surveyResponses', JSON.stringify(existingResponses));
    displayResponses(existingResponses); // Update the review section
  }

  function displayResponses(responses) {
    const review = document.getElementById('review');
    review.innerHTML = ''; // Clear the review section

    if (responses.length === 0) {
      review.innerHTML = '<p>No responses yet.</p>';
      return;
    }

    responses.forEach((response, index) => {
      const responseDiv = document.createElement('div');
      responseDiv.classList.add('response');

      responseDiv.innerHTML = `
        <p><strong>Name:</strong> ${response.name}</p>
        <p><strong>Age:</strong> ${response.age}</p>
        <p><strong>Email:</strong> ${response.email}</p>
      `;

      if (response.question1 === 'yes') {
        responseDiv.innerHTML += `
          <p><strong>Do you like programming?</strong> Yes</p>
          <p><strong>Favorite Programming Language:</strong> ${response.favoriteLanguage}</p>
          <p><strong>Expertise Level:</strong> ${response.experienceLevel}</p>
          <p><strong>Coding Frequency:</strong> ${response.codingFrequency}</p>
          <p><strong>Technological Interests:</strong> ${response.techInterest}</p>
        `;
      } else if (response.question1 === 'no') {
        responseDiv.innerHTML += `
          <p><strong>Do you like programming?</strong> No</p>
          <p><strong>Reason:</strong> ${response.reason}</p>
          <p><strong>Other Interests:</strong> ${response.alternativeInterest}</p>
          <p><strong>Challenges:</strong> ${response.challenges}</p>
        `;
      }

      responseDiv.innerHTML += `
        <button class="delete-button" onclick="handleDeleteResponse(${index})">Delete</button>
      `;

      review.appendChild(responseDiv);
    });
  }

  // On page load, display saved responses
  window.onload = function () {
    const savedResponses = JSON.parse(localStorage.getItem('surveyResponses'));
    if (savedResponses) {
      displayResponses(savedResponses);
    }
  };