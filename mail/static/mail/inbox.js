document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archive').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  const form = document.querySelector('#compose-form')
  form.addEventListener('submit', submitEmail);

  // By default, load the inbox
  load_mailbox('inbox');
});

function changeButton(mailbox){
  document.querySelectorAll('.boxbtn').forEach( btn => {
    btn.classList.add('btn-outline-primary')
    btn.classList.remove('btn-primary');
  })
  document.getElementById(mailbox).classList.remove('btn-outline-primary')
  document.getElementById(mailbox).classList.add('btn-primary');
}

function compose_email() {
  changeButton('compose')
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


function load_mailbox(mailbox) {
  changeButton(mailbox)
  let mailView = document.querySelector('#emails-view');

  // Show the mailbox and hide other views
  mailView.style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  mailView.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //get Emails
  getEmails(mailbox, mailView);

 
}

function submitEmail(event){
  event.preventDefault();
  let messages = document.querySelector('.alert');
  if(messages){
    messages.remove();
  }

  const recipients = document.querySelector('#compose-recipients').value
  const subject = document.querySelector('#compose-subject').value
  const mailBody = document.querySelector('#compose-body').value
  const form = document.querySelector('#compose-form')

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: mailBody
    })
  })
  .then(response => response.json())
  .then(result => {
      
      if(result.error){
        createMessage('error', result.error, form)
      }else{
        load_mailbox('sent')
        createMessage('success', result.message, document.getElementById('emails-view'))
      }
      
  });

  return false;
}

function createMessage(type, message, element){
  messageBox = document.createElement('div');
  messageBox.classList = `alert alert-${ type == 'error' ? 'danger' : 'success'}`
  messageBox.innerHTML = message

  closeButton = document.createElement('button')
  closeButton.classList = 'close'
  closeButton.innerHTML = ' <span aria-hidden="true">&times;</span>'
  closeButton.addEventListener('click', closemessage)
  messageBox.append(closeButton)

  element.prepend(messageBox);
}

function closemessage(){
  document.querySelector('.alert').remove()
}

function  getEmails(mailbox, view){
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(emails)
    if(emails.length > 0){
      if(mailbox != 'sent'){
        createArchiveButton(mailbox, view)
        createUnreadButton(mailbox, view)
      }
    }else{
      let noEmails = document.createElement('p')
      noEmails.innerHTML = 'No emails here'
      view.append(noEmails)
      return
    }

    emails.forEach(email => {
      let mailLine = document.createElement('div');
      mailLine.classList = `mailLine d-flex justify-content-between align-items-center ${email.read ? "read" : ""}`
      mailLine.addEventListener('click', () => { openEmail(email.id)})

      let mailCheck = document.createElement('label')
      mailCheck.classList = 'mailCheck';
      mailCheck.for = `check${email.id}`
     
      let  mailCheckInput = document.createElement('input')
       mailCheckInput.id = `check${email.id}`
       mailCheckInput.classList = 'mailCheckInput';
       mailCheckInput.type = 'checkbox'
       mailCheckInput.value = email.id
      mailCheck.append( mailCheckInput)

      let mailFrom = document.createElement('div')
      mailFrom.classList = 'mailFrom'
      mailFrom.innerHTML = email.sender

      let mailContent = document.createElement('div');
      mailContent.classList = 'mailContent'
      let text = `${email.subject} - ${email.body}`
      let contentText = text.slice(0, 80);
      if(text.length > 80){
        contentText = contentText + '...'
      }
      mailContent.innerHTML = contentText

      let mailDate = document.createElement('div')
      mailDate.classList = 'mailDate'
      mailDate.innerHTML = email.timestamp

      if(mailbox != 'sent'){
        mailLine.append(mailCheck)
      }else{
        mailFrom.innerHTML = 'To: ' + email.recipients
        mailFrom.classList.add('sents')
      }

      mailLine.append(mailFrom, mailContent, mailDate)

      view.append(mailLine)
    });
    
  });
}

function createArchiveButton(mailbox, view){
  let archiveButton = document.createElement('button')
  if(mailbox == 'inbox'){
    archiveButton.innerHTML = 'Archive'
    archiveButton.classList = 'btn btn-info my-2'
    archiveButton.addEventListener('click', archiveMails)
  }else if(mailbox == 'archive'){
    archiveButton.innerHTML = 'Unarchive'
    archiveButton.classList = 'btn btn-warning my-2'
    archiveButton.addEventListener('click', unArchiveMails)
  }
  view.append(archiveButton);
}

function createUnreadButton(mailbox, view){
  let unreadButton = document.createElement('button')
  unreadButton.innerHTML = 'Unread'
  unreadButton.classList = 'btn btn-primary my-2 ml-3'
  unreadButton.addEventListener('click', () => { unreadMails(mailbox) })
  view.append(unreadButton);
}

async function getSingleEmail(id){
  const response =  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      return  email
  });
  return response
}

async function openEmail(id){
  console.log(event.target.classList[0])
  if(event.target.classList[0] == 'mailCheck' || event.target.classList[0] == 'mailCheckInput'){
    return
  }

  markAsRead(id)

  const email = await  getSingleEmail(id);
  const mailView = document.querySelector('#emails-view');

  let mailPage = document.createElement('div')
  mailPage.id = 'mailPage'

  let mailHead = document.createElement('div')
  mailHead.classList = 'mailHead'
  mailHead.innerHTML = `
  <h4>Subject: ${email.subject.charAt(0).toUpperCase() + email.subject.slice(1)}</h4>
  <p>From: ${email.sender}</p>
  <p>To: ${email.recipients[0]}</p>
  <p>Date: ${email.timestamp}</p>
  `

  let mailBody = document.createElement('div')
  mailBody.classList = 'mailBody'
  mailBody.innerHTML = email.body

  let mailFooter = document.createElement('div')
  mailFooter.classList = 'mailFooter row mx-0'
  
  let mailFooterArchive = document.createElement('div')
  mailFooterArchive.classList = "col-3 ml-auto my-4 pr-0"

  if(!email.archived){
    mailFooterArchive.innerHTML = '<button class="btn btn-primary w-100">Archive</button>'
    mailFooterArchive.addEventListener('click', () => { archiveOne(email.id, true)})
  }else{
    mailFooterArchive.innerHTML = '<button class="btn btn-warning w-100">Unarchive</button>'
    mailFooterArchive.addEventListener('click', () => { archiveOne(email.id, false)})
  }

  let mailFooterReply = document.createElement('div')
  mailFooterReply.classList = "col-6 ml-3 my-4 pr-0"
  mailFooterReply.innerHTML = '<button class="btn btn-success w-100">Reply</button>'
  mailFooterReply.addEventListener('click', () => { reply(email)})

  if(email.sender != document.querySelector('h2').innerHTML || email.archived){
    mailFooter.append(mailFooterArchive)
  }else{
    mailFooterReply.classList.add('ml-auto')
  }
  mailFooter.append(mailFooterReply)

  mailPage.append(mailHead, mailBody)

  mailView.innerHTML = ''
  mailView.append(mailPage, mailFooter)
}

function reply(email){
    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    const subject = (email.subject.includes("Re:") ? '' : 'Re: ') + email.subject
    const body = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`
  
    // Clear out composition fields
    document.querySelector('#compose-recipients').value = email.sender;
    document.querySelector('#compose-subject').value = subject;
    document.querySelector('#compose-body').value = body;
}

function archiveMails(){
  let checks = document.querySelectorAll('.mailCheckInput:checked')
  if(checks.length > 0){
    let c = 0;
    checks.forEach( check => {
      if(check.checked ){
        markAsArchived(check.value, true, (c == checks.length - 1))
        c++
      }
     })

  }

}
function unArchiveMails(){
  let checks = document.querySelectorAll('.mailCheckInput:checked')
  if(checks.length > 0){
    let c = 0;
    checks.forEach( check => {
      if(check.checked ){
        markAsArchived(check.value, false, (c == checks.length - 1))
        c++
      }
     })

  }
}

async function archiveOne(id, mode){
  await markAsArchived(id, mode, true)
}

async function markAsArchived(id, archived = true, last=false){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: archived
    })
  }).then( () => { 
    if(last){
      if(archived){
        load_mailbox('archive')
        createMessage('success', 'Mails archived success', document.getElementById('emails-view'))
      }else{
        load_mailbox('inbox')
        createMessage('success', 'Mails unarchived success', document.getElementById('emails-view'))
      }
    }
   
    return true 
  })
}

async function unreadMails(mailbox){
  let checks = document.querySelectorAll('.mailCheckInput:checked')
  if(checks.length > 0){
    let c = 0;
    checks.forEach( check => {
      if(check.checked ){
        console.log(c)
        markAsUnRead(check.value, mailbox, (c == checks.length - 1))
        c++
      }
     })
   
  }
}

async function markAsRead(id){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  }).then( () => { return true })
}

function markAsUnRead(id, mailbox, last=false){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: false
    })
  }).then( () => { 
    if(last){
      if(mailbox == 'archive'){
        load_mailbox('archive')
      }else{
        load_mailbox('inbox')
      }
      createMessage('success', 'Mails marked as unread', document.getElementById('emails-view'))
    }
    return true
  })
}
