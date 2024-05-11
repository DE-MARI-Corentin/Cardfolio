import requests
from bs4 import BeautifulSoup
import urllib
import os

url = 'https://noeve-grafx.com/catalogue-des-cartes-noeve-grafx/'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')
os.makedirs('nvg_images', exist_ok=True)


card_data = []
for card in soup.find_all('dl', class_='gallery-item'):
    name = card.find('dd').text.replace("\n\t","").replace("Carte ","")
    image_url = card.find('img')['src']
    image_name = name + '.jpg'
    image_path = os.path.join('nvg_images', image_name)
    urllib.request.urlretrieve(image_url, image_path)
    card_data.append({'name': name, 'image_url': image_path})

