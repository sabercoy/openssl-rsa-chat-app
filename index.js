window.onload = () => {
  const aliceButton = document.getElementById('alice-generate-button')
  const bobButton = document.getElementById('bob-generate-button')
  const aliceMessage = document.getElementById('alice-message')
  const bobMessage = document.getElementById('bob-message')

  aliceButton.onclick = () => generateKeys('alice')
  bobButton.onclick = () => generateKeys('bob')
  aliceMessage.oninput = (e) => updateBase64('alice', e.target.value)
  bobMessage.oninput = (e) => updateBase64('bob', e.target.value)
}

const updateBase64 = (name, newValue) => {
  document.getElementById(`${name}-base64`).value = btoa(newValue)
}

const generateKeys = async (name) => {
  console.log(name)
  const response = await fetch(
    'http://localhost:8080/generate-key-pair',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name })
    }
  )

  const keys = await response.json()

  const privateKeyDisplay = document.createElement('textarea')
  privateKeyDisplay.setAttribute('disabled', 'true')
  privateKeyDisplay.value = keys.privateKey

  const publicKeyDisplay = document.createElement('textarea')
  publicKeyDisplay.setAttribute('disabled', 'true')
  publicKeyDisplay.value = keys.publicKey

  const sendMessageButton = document.createElement('button')
  sendMessageButton.id = `${name}-send-button`
  sendMessageButton.setAttribute('disabled', 'true')
  sendMessageButton.classList.add('button')
  sendMessageButton.innerHTML = 'SEND MESSAGE'
  document.getElementById(`${name}-generate-button`).replaceWith(sendMessageButton, privateKeyDisplay, publicKeyDisplay)
  
  const aliceSendButton = document.getElementById('alice-send-button')
  const bobSendButton = document.getElementById('bob-send-button')

  if (aliceSendButton && bobSendButton) {
    aliceSendButton.disabled = false
    bobSendButton.disabled = false
    aliceSendButton.onclick = () => sendMessage('alice')
    bobSendButton.onclick = () => sendMessage('bob')
  }
}

const sendMessage = async (sender) => {
  const receiver = sender === 'alice' ? 'bob' : 'alice'
  const message = document.getElementById(`${sender}-message`).value

  const response = await fetch(
    'http://localhost:8080/encrypt-message',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message, receiver })
    }
  )

  const encryptedBase64 = (await response.json()).encryptedBase64

  document.getElementById('middle-base64').value = encryptedBase64

  await receiveMessage(encryptedBase64, receiver)
}

const receiveMessage = async (encryptedBase64, receiver) => {
  const response = await fetch(
    'http://localhost:8080/decrypt-message',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ encryptedBase64, receiver })
    }
  )

  const message = (await response.json()).message

  document.getElementById(`${receiver}-message`).value = message
  updateBase64(receiver, message)
}
