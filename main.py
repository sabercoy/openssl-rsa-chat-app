import base64
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import subprocess
import webbrowser

def generate_key_pair(name):
  public_file_name = f'{name}-public.pem'
  private_file_name = f'{name}-private.pem'

  subprocess.call(['openssl', 'genrsa', '-out', private_file_name, '2048'])
  subprocess.call(['openssl', 'rsa', '-in', private_file_name, '-pubout', '-out', public_file_name])

  private_key = open(private_file_name).read()
  public_key = open(public_file_name).read()

  return (private_key, public_key)

def encrypt_message(message, receiver):
  encrypted_bytes = subprocess.check_output(['openssl', 'pkeyutl', '-encrypt', '-pubin', '-inkey', f'{receiver}-public.pem'], input=message.encode('utf-8'))
  encrypted_base64 = base64.b64encode(encrypted_bytes).decode('utf-8')

  return encrypted_base64

def decrypt_message(encrypted_base64, receiver):
  encrypted_bytes = base64.b64decode(encrypted_base64.encode('utf-8'))
  message = subprocess.check_output(['openssl', 'pkeyutl', '-decrypt', '-inkey', f'{receiver}-private.pem'], input=encrypted_bytes)
  
  return message.decode('utf-8')

class MyRequestHandler(SimpleHTTPRequestHandler):
  def do_POST(self):
    content_length = int(self.headers['Content-Length'])
    raw_body = self.rfile.read(content_length)
    
    try:
      body = json.loads(raw_body)
      path = self.path

      if (path == '/generate-key-pair'):
        (private_key, public_key) = generate_key_pair(body['name'])
        response_data = {'privateKey': private_key, 'publicKey': public_key}
      elif (path == '/encrypt-message'):
        encrypted_base64 = encrypt_message(body['message'], body['receiver'])
        response_data = {'encryptedBase64': encrypted_base64}
      elif (path == '/decrypt-message'):
        message = decrypt_message(body['encryptedBase64'], body['receiver'])
        response_data = {'message': message}

      response_content = json.dumps(response_data)
      self.send_response(200)
      self.send_header('Content-type', 'application/json')
      self.end_headers()
      self.wfile.write(response_content.encode('utf-8'))
    except json.JSONDecodeError:
      self.send_response(400)
      self.end_headers()
      self.wfile.write(b'Invalid JSON data')

def run(server_class=HTTPServer, handler_class=MyRequestHandler, port=8080):
  server_address = ('', port)
  httpd = server_class(server_address, handler_class)
  print('Starting http server on port %d...' % port)
  httpd.serve_forever()

webbrowser.open('http://localhost:8080/')

run()