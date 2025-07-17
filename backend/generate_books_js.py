from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
import os, json

gauth = GoogleAuth()
gauth.CommandLineAuth()
drive = GoogleDrive(gauth)


def recursive_scan(folder_id, region, path_prefix=""):
    file_list = drive.ListFile(
        {'q': f"'{folder_id}' in parents and trashed=false"}
    ).GetList()

    books = []
    for file in file_list:
        if file["mimeType"] == "application/vnd.google-apps.folder":
            books += recursive_scan(file["id"], region,
                                    os.path.join(path_prefix, file["title"]))
        elif file["mimeType"] == "application/pdf":
            books.append({
                "title": file["title"]
                         .replace(".pdf", "")
                         .replace("_", " ")
                         .title(),
                "path": path_prefix,
                "drive_url": f"https://drive.google.com/file/d/{file['id']}/view?usp=sharing"
            })
    return books



mainland_folder_id = "1INxk5402iepR7l_y2pbZt292z4Fg3gX6"
hongkong_folder_id = "1fLbgT17jKz3WFB8SkuHxQBpiocrEcupU"

regions = {
    "mainland": {
        "name": "内地小学数学教材",
        "books": recursive_scan(mainland_folder_id, "mainland")
    },
    "hongkong": {
        "name": "香港教材",
        "books": recursive_scan(hongkong_folder_id, "hongkong")
    }
}


with open("books.js", "w", encoding="utf-8") as f:
    f.write("const regions = ")
    json.dump(regions, f, ensure_ascii=False, indent=2)
    f.write(";") 

