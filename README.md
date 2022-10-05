# Commerce
## Description
CS50’s [Web Programming with Python and JavaScript](https://cs50.harvard.edu/web/2020/) Project 3 - [Commerce](https://cs50.harvard.edu/web/2020/projects/3/mail)

## Project description
Design a front-end for an email client that makes API calls to send and receive emails.


## Installation
You will need [Python](https://www.python.org/) with [Django library](https://www.djangoproject.com/)  
```
• Clone the package  
• python manage.py makemigrations auctions  
• python manage.py migrate  
• python manage.py runserver  
• python manage.py createsuperuser
```

## Specification
Using JavaScript, HTML, and CSS, complete the implementation of your single-page-app email client inside of inbo .js (and not additional or other files; for grading purposes, we’re only going to be considering inbo .js!). You must fulfill the following requirements:
- [ ] Send Mail: When a user submits the email composition form, add JavaScript code to actually send the email.
  - [ ] You’ll likely want to make a POST request to /emails, passing in values for recipients, subject, and body.
  - [ ]Once the email has been sent, load the user’s sent mailbo .
- [ ]Mailbo : When a user visits their Inbo , Sent mailbo , or Archive, load the appropriate mailbo .
  - [ ]You’ll likely want to make a GET request to /emails/<mailbo > to request the emails for a particular mailbo .
  - [ ]When a mailbo  is visited, the application should first query the API for the latest emails in that mailbo .
  - [ ]When a mailbo  is visited, the name of the mailbo  should appear at the top of the page (this part is done for you).
  - [ ]Each email should then be rendered in its own bo  (e.g. as a <div> with a border) that displays who the email is from, what the subject line is, and the timestamp of the email.
  - [ ]If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.
- [ ]View Email: When a user clicks on an email, the user should be taken to a view where they see the content of that email.
  - [ ]You’ll likely want to make a GET request to /emails/<email_id> to request the email.
  - [ ]Your application should show the email’s sender, recipients, subject, timestamp, and body.
  - [ ]You’ll likely want to add an additional div to inbo .html (in addition to emails-view and compose-view) for displaying the email. Be sure to update your code to hide and show the right views when navigation options are clicked.
  - [ ]See the hint in the Hints section about how to add an event listener to an HTML element that you’ve added to the DOM.
  - [ ]Once the email has been clicked on, you should mark the email as read. Recall that you can send a PUT request to /emails/<email_id> to update whether an email is read or not.
- [ ]Archive and Unarchive: Allow users to archive and unarchive emails that they have received.
  - [ ]When viewing an Inbo  email, the user should be presented with a button that lets them archive the email. When viewing an Archive email, the user should be presented with a button that lets them unarchive the email. This requirement does not apply to emails in the Sent mailbo .
  - [ ]Recall that you can send a PUT request to /emails/<email_id> to mark an email as archived or unarchived.
  - [ ]Once an email has been archived or unarchived, load the user’s inbo .
- [ ]Reply: Allow users to reply to an email.
  - [ ]When viewing an email, the user should be presented with a “Reply” button that lets them reply to the email.
  - [ ]When the user clicks the “Reply” button, they should be taken to the email composition form.
  - [ ]Pre-fill the composition form with the recipient field set to whoever sent the original email.
  - [ ]Pre-fill the subject line. If the original email had a subject line of foo, the new subject line should be Re: foo. (If the subject line already begins with Re: , no need to add it again.)
  - [ ]Pre-fill the body of the email with a line like "On Jan 1 2020, 12:00 AM foo@e ample.com wrote:" followed by the original te t of the email.