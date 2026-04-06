document.querySelector("form").addEventListener("submit", function (e) {
    const phone = document.querySelector("#phone").value;
    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      e.preventDefault();
    }
  });
  document.getElementById("bookingForm").addEventListener("submit", async function (e) {
    e.preventDefault(); 
  
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
  
    try {
      const response = await fetch(this.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
  
      const text = await response.text();
  
      
      showNotification("✅ Booking query sent! Wait for approval.");
      
      
      this.reset();
    } catch (err) {
      showNotification("❌ Something went wrong. Try again.");
    }
  });
  
  
  function showNotification(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#5c0469";
    toast.style.color = "#fff";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "10px";
    toast.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
    toast.style.zIndex = "9999";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s ease";
  
    document.body.appendChild(toast);
  
    setTimeout(() => (toast.style.opacity = "1"), 100); 
    setTimeout(() => {
      toast.style.opacity = "0"; 
      setTimeout(() => toast.remove(), 400); 
    }, 4000);
  }
  
  