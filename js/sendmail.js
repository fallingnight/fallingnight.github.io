// JavaScript Document
document.getElementById('mail_form').addEventListener('submit', function(event) {
  event.preventDefault();

  const to = "bingluyuniao@gmail.com";
  const subject = document.getElementById('textsubject').value;
  const body = document.getElementById('textbody').value;

  const mailtoLink = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.open(mailtoLink);
});