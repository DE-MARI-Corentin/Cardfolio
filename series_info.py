import requests
import os
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import mysql.connector
  
         
url = 'https://noeve-grafx.com/catalogue/?_sf_ppp=400'
# Créer le dossier pour enregistrer les images si nécessaire
if not os.path.exists('nvg_manga'):
    os.makedirs('nvg_manga')
    
dossier_images = 'nvg_images'

# Liste pour stocker les valeurs uniques
valeurs_uniques = []

# Parcourir les fichiers du dossier
for nom_fichier in os.listdir(dossier_images):
    # Vérifier si le fichier est une image JPG
    if nom_fichier.endswith('.jpg') and nom_fichier.startswith('NG-PR'):
        # Supprimer les chiffres en fin de nom de fichier
        nom_fichier = ''.join([i for i in nom_fichier if not i.isdigit()])
        # Extraire la partie du nom de fichier entre le dernier '-' et '.jpg'
        debut_nom = nom_fichier.rfind('-') + 1
        fin_nom = nom_fichier.rfind('.jpg')
        valeur = nom_fichier[debut_nom:fin_nom]
        # Ajouter la valeur à la liste des valeurs uniques si elle n'est pas déjà présente
        if valeur not in valeurs_uniques:
            valeurs_uniques.append(valeur)

connection = mysql.connector.connect(
    host="192.168.1.155",
    port="3310",
    user="svc-development",
    password="R?9jrdJyNhP8egDF",
    database="cardfolio"
)
cursor = connection.cursor()

# Télécharger le contenu de la page
response = requests.get(url)
if response.status_code == 200:
    # Analyser le HTML
    soup = BeautifulSoup(response.text, 'html.parser')
    h2_entry_title = soup.find_all('h2', class_='entry-title')
    manga_links = []
    
    for h2 in h2_entry_title:
        # Trouver tous les liens vers les mangas
        manga_link = h2.find('a').get('href')
        manga_response = requests.get(manga_link)
        if manga_response.status_code == 200:
            manga_soup = BeautifulSoup(manga_response.text, 'html.parser')
            
            # Récupérer le nom du manga
            manga_name = manga_soup.find('h1', class_='entry-title').text.strip()

            # Récupérer les auteurs
            authors_div = manga_soup.find('div', class_='et_pb_text_inner')
            authors = ", ".join([author.text.strip() for author in authors_div.find_all('a')])

            # Récupérer le synopsis
            synopsis_div = manga_soup.find('h2', string='Synopsis').find_next('div', class_='et_pb_text_inner')
            synopsis = "\n".join([p.text.strip() for p in synopsis_div.find_all('p')])

            # Récupérer l'image
            image_div = manga_soup.find('h1', class_='entry-title').find_next('span', class_='et_pb_image_wrap')
            image_span = image_div.find('img')
            image_url = image_span['src']
            image_name = manga_name + ".png"
            image_path = os.path.join('nvg_manga', image_name)
            with open(image_path, 'wb') as img_file:
                img_response = requests.get(image_url)
                img_file.write(img_response.content)

                
            # Liste pour stocker les codes correspondants
            codes_correspondants = ""
            premiere_lettre = ""
                # Diviser le nom du manga en mots
            mots = manga_name.split()

                # Parcourir chaque mot du nom du manga
            for mot in mots:
                    # Récupérer la première lettre de chaque mot et la convertir en majuscule
                premiere_lettre += mot[0].upper()
                    
                    # Parcourir chaque code unique
            try:
                index = valeurs_uniques.index(premiere_lettre)
                codes_correspondants = valeurs_uniques[index]
            except:
                codes_correspondants = ""                      
            # Afficher les informations récupérées
            print("Nom du manga:", manga_name)
            print("Code du manga:", codes_correspondants)
            print("Auteurs:", authors)
            print("Synopsis:", synopsis)
            print("Image enregistrée:", image_path)
            print("-" * 50)
            # Exécution de la requête SQL pour insérer les données
            try :
                sql = "INSERT INTO series (name, autheur, code, synopsis, image) VALUES (%s, %s, %s, %s, %s)"
                cursor.execute(sql, (manga_name, authors, codes_correspondants, synopsis, img_response.content))
                # Commit des changements
                connection.commit()
            except mysql.connector.IntegrityError as e:
                if e.errno == 1062:  # Erreur de clé dupliquée
                    print("Une ligne avec les mêmes données existe déjà dans la base de données.")
                else:
                    print("Une erreur s'est produite lors de l'insertion dans la base de données :", e)

        else:
            print("La requête a échoué avec le code :", manga_response.status_code)

else:
    print("La requête a échoué avec le code :", response.status_code)


# Fermeture de la connexion à la base de données
cursor.close()
connection.close()
