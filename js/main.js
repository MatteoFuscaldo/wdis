document.addEventListener('DOMContentLoaded', () => {
    const icons = document.querySelectorAll('.icon');
    icons.forEach(icon => {
      icon.addEventListener('click', () => {
        const category = icon.dataset.category;
        fetchRandomMessage(category).then(message => {
          showPopup(message);
        });
      });
    });
  
    function fetchRandomMessage(category) {
      return fetch(`/data/${category}.yml`)
        .then(response => response.text())
        .then(yamlString => {
          const messages = jsyaml.load(yamlString);
          return messages[Math.floor(Math.random() * messages.length)];
        });
    }
  
    function showPopup(message) {
      const popup = document.createElement('div');
      popup.className = 'popup';
      popup.textContent = message;
      popup.innerHTML += '<br><button onclick="hidePopup()">Close</button>';
      popup.innerHTML += '<br><button onclick="shareWhatsApp(\'' + message + '\')">Share on WhatsApp</button>';
      popup.innerHTML += '<br><button onclick="shareX(\'' + message + '\')">Share on X</button>';
      document.body.appendChild(popup);
      
      // Show popup
      popup.style.display = 'block';
    }
  
    window.hidePopup = function() {
      document.querySelector('.popup').remove();
    };
  
    window.shareWhatsApp = function(message) {
      window.open('whatsapp://send?text=' + encodeURIComponent(message));
    };
  
    window.shareX = function(message) {
      window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(message));
    };
  });
