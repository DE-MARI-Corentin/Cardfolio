import os
import re
import mysql.connector

# Connexion à la base de données
connection = mysql.connector.connect(
    host="192.168.1.155",
    port="3310",
    user="svc-development",
    password="R?9jrdJyNhP8egDF",
    database="cardfolio"
)
cursor = connection.cursor()

# Fonction pour récupérer le nom du manga à partir du code
def get_manga_name_from_code(code):
    query = "SELECT name FROM series WHERE code = %s"
    cursor.execute(query, (code,))
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        return None

# Dossier contenant les images des cartes
dossier_images = 'nvg_images'

# Parcourir les fichiers du dossier
for nom_fichier in os.listdir(dossier_images):
    if os.path.isfile(os.path.join(dossier_images, nom_fichier)):
        # Extraire le code, le numéro de tome et le nom du manga à partir du nom du fichier
        match = re.match(r'(NG)(-[a-zA-Z]+)?(\d+)(-[a-zA-Z\&]+)?(\d+)?( DX)?(-JE|-JV)?\.(jpg|jpeg|png)$', nom_fichier)
        if match:
            code = match.group(1) + (match.group(2) if match.group(2) else "")
            rarity = match.group(2) if match.group(2) else ""
            numero_tome = match.group(3)
            extension = match.group(5)
            manga_name = get_manga_name_from_code(code)
        
            if manga_name:
                # Construire le lien vers la carte
                lien_carte = f"https://noeve-grafx.com/tome-manga/{manga_name}"
                print("Code de la carte:", code)
                print("Rareté:", rarity)
                print("Numero de tome:", numero_tome)
                print("Extension:", extension)
                print("Nom du manga:", manga_name)
                print("Lien de la carte:", lien_carte)
                print("-" * 50)

# Fermeture de la connexion à la base de données
cursor.close()
connection.close()


#https://noeve-grafx.com/tome-manga/arrete-de-me-chauffer-nagatoro-t02-2/
#PROMO : 
#rarity = 2
#code = 4
#numero_tome = ''
#numero_carte = 3
#special = 7 (-JE/-JV)

#<div class="et_pb_text_inner">Date de sortie : 11 mars 2022</div>

#SECRET : 
#rarity = 2
#code = 4
#numero_tome = ''
#numero_carte = 3
#special = 7 (-JV)



#NORMAL : 
#rarity = ''
#code = 4
#numero_tome = 5
#numero_carte = 3
#special = ''
