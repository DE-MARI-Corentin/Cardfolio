import os
import re
import mysql.connector
from unidecode import unidecode
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import locale

locale.setlocale(locale.LC_TIME, "fr_FR")
# Connexion à la base de données
connection = mysql.connector.connect(
    host="192.168.1.155",
    port="3310",
    user="svc-development",
    password="R?9jrdJyNhP8egDF",
    database="cardfolio"
)
cursor = connection.cursor(buffered=True)

notFound = []

# Fonction pour récupérer le nom du manga à partir du code
def get_manga_name_from_code(code):
    query = "SELECT name, id FROM series WHERE code = %s"
    cursor.execute(query, (code,))
    result = cursor.fetchone()
    if result:
        return result[0], result[1]
    else:
        return None

def get_rarity_name_from_code(rarity):
    query = "SELECT id FROM rarities WHERE code = %s"
    cursor.execute(query, (rarity,))
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        return None
    
def extract_ean(soup):
    ean_div = soup.find(lambda tag: tag.name == 'div' and tag.get_text().startswith('EAN :'))
    if ean_div:
        ean = ean_div.get_text().split(' : ')[1]
        return ean
    return None

def extract_release_date(soup):
    release_date_div = soup.find('div', class_='et_pb_text_inner', string=lambda text: text and text.startswith('Date de sortie :'))
    if release_date_div:
        release_date_text = release_date_div.text.strip()
        if 'Date de sortie :' in release_date_text:
            # Extraire la date au format 'jour mois année'
            release_date_str = release_date_text.split('Date de sortie :')[1].strip()
            # Convertir la date au format 'dd-mm-aaaa'
            try:
                release_date = datetime.strptime(release_date_str, '%d %B %Y')
                return release_date
            except ValueError:
                return None
    return None

def get_ean_and_release_date(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        release_date = extract_release_date(soup)
        ean = extract_ean(soup)
        return ean, release_date
    return None, None

def is_page_available(url):
    response = requests.get(url)
    if response.status_code == 200:
        return True
    else:
        notFound.append(url)
        return False

# Dossier contenant les images des cartes
dossier_images = 'nvg_images'

# Parcourir les fichiers du dossier
for nom_fichier in os.listdir(dossier_images):
    if os.path.isfile(os.path.join(dossier_images, nom_fichier)):
        with open(os.path.join(dossier_images, nom_fichier), 'rb') as f:
            image_blob = f.read()
            
        image_name = nom_fichier.split('.')[0]
        # Extraire le code, le numéro de tome et le nom du manga à partir du nom du fichier
        match = re.match(r'(NG)(-[a-zA-Z]+)?(\d+)(-[a-zA-Z\&]+)?(\d+)?( DX)?(-JE|-JV)?\.(jpg|jpeg|png)$', nom_fichier)
        if match:
            code = re.sub('-', '', match.group(4))
            rarity = match.group(2) if match.group(2) else ""
            numero_tome = match.group(5) if match.group(5) else ""
            numero_carte = match.group(3)
            special = re.sub('-', '', match.group(7)) if match.group(7) else ""
            deluxe = match.group(6) if match.group(6) else ""
            manga_name, manga_id = get_manga_name_from_code(code)
            rarity_id = get_rarity_name_from_code(rarity)
            
            # Vérifier si la carte et l'image existent déjà dans la table cards
            query = "SELECT id FROM cards WHERE name = %s AND series_id = %s AND rarity_id = %s"
            cursor.execute(query, (image_name, manga_id, rarity_id))
            existing_card = cursor.fetchone()
            if not existing_card:
                manga_name_format_url = re.sub(' ', '-', manga_name)
                manga_name_format_url = re.sub("'", '', manga_name_format_url)
                manga_name_format_url = re.sub('---', '-', manga_name_format_url)
                manga_name_format_url = unidecode(manga_name_format_url).lower()
                if numero_tome:
                    manga_name_format_url += '-t'+ numero_tome
                    if deluxe:
                        manga_name_format_url += '-2'
                if rarity == '-PR' or rarity ==  '-SE':
                    manga_name_format_url += '-t01'
                lien_carte = f"https://noeve-grafx.com/tome-manga/{manga_name_format_url}"
                #is_page_available(lien_carte)
                ean, release_date = get_ean_and_release_date(lien_carte)
                
                obtains = ""                
                if rarity == '-PR':
                    obtains = "Dans les librairies participantes à la sortie de la séries " + manga_name + " sinon en convention sur les stands Noeve Grafx."
                elif rarity == '-SE':
                    obtains = "Créé à l’occasion d’événements particuliers, de fins de série, ou en clin d’œil… certaines peuvent donc contenir des spoilers ! Selon les cas, elles sont disponibles via la boutique à points en convention, ou uniquement sous des conditions particulières"
                else:
                    if release_date and release_date.year >= 2023:
                        obtains = "Avec le tome " + numero_tome + " de la série " + manga_name + " imprimé avant janvier 2023."
                    elif release_date and release_date.year < 2023:
                        obtains = "Fourni avec le tome " + numero_tome + " de la série " + manga_name + "."    
                isJE = False
                if special == 'JE':
                    isJE = True
                    obtains = "En convention sur les stands Noeve Grafx."
                elif special == 'JV':
                    obtains = ""
                    

                

                if manga_name:
                    # Construire le lien vers la carte
                    print("Code de la carte:", code)
                    print("Rareté:", rarity_id)
                    print("Numero de tome:", numero_tome)
                    print("Numero de carte:", numero_carte)
                    print("Special:", special)
                    print("Nom du manga:", manga_name)
                    print("Lien de la carte:", lien_carte)
                    print("Id du manga:", manga_id)
                    print("EAN:", ean)
                    print("Date de sortie:", release_date.strftime('%d-%m-%Y')) if release_date else print("Date de sortie:", release_date)
                    print("Obtention:", obtains)
                    print("-" * 50)
                    
                insert_query = """
                INSERT INTO cards (name, image, published_date, series_id, rarity_id, obtain, is_japan_expo, url_nv, ean) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_query, (image_name, image_blob,release_date , manga_id, rarity_id, obtains, isJE, lien_carte, ean))
                connection.commit()
                print("La carte a été insérée avec succès.")
            else:
                print("La carte existe déjà dans la base de données.")
                
print(notFound)
# Fermeture de la connexion à la base de données
cursor.close()
connection.close()


