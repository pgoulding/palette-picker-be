# Palette Picker Back End server



[![Build Status](https://travis-ci.org/pgoulding/palette-picker-be.svg?branch=master)](https://travis-ci.org/pgoulding/palette-picker-be)

[Palette Picker Front End](https://github.com/David5280/palette-picker-fe)

[Deployed Server](https://pallete-picker-de-pg.herokuapp.com/)




## End Points for Server
| URL | VERB | OPTIONS | EXAMPLE RESPONSE | STATUS CODE |
|----------------------|:------:|:--------------------------------------------------------------------------------------------:|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|
| / | GET | N/A | text:"Palette Picker is running on port <port number>" | 200 (OK) |
| /api/v1/projects/ | GET | N/A | [{ name:"Project Name 1", id:1, "created_at": "2019-08-28T21:40:20.512Z","updated_at": "2019-08-28T21:40:20.512Z"},{...}] | 200 (OK) |
| /api/v1/projects/:id | GET | N/A | {"id": 12 `primary-key`, "name": "Example", "created_at": "2019-08-28T21:40:20.512Z", "updated_at": "2019-08-28T21:40:20.512Z", "palette": [{"id": 26, `palette primary-key` "name": "palette 1", `palette name` "created_at": "2019-08-29T08:04:23.417Z", "updated_at": "2019-08-29T08:04:23.417Z", "color_1": "B9472E", "color_2": "2C761D", "color_3": "1D7673", "color_4": "463C88", "color_5": "C00242", "project_id": 12, `foreign key, relates to project` }, {...}, {...}]} | 200 (OK) |
| /api/v1/palettes/ | GET | N/A | [{"id": 21 `primary-key`, "name": "Warm" `palette name`, "color_1": "#000123", "color_2": "#900123", "color_3": "#J00123", "color_4": "#000123", "color_5": "#000123", "project_id": 18 `foreign key relates to project`, "created_at": "2019-08-29T08:02:27.370Z", "updated_at": "2019-08-29T08:02:27.370Z"}, {..}, {..}] | 200 (OK) |
| /api/v1/palettes/:id | GET | N/A interpreted through the request parameters (link)  | {"id": 19, `primary key` "name": "Cool" `palette name`,"color_1": "#H00123", "color_2": "#A00123", "color_3": "#G00123", "color_4":"#670123", "color_5": "#000123", "project_id": 18 `foreign key for project`, "created_at": "2019-08-29T08:02:27.370Z", "updated_at": "2019-08-29T08:02:27.370Z"  } | 200 (OK) |
| /api/v1/palettes/ | POST | required keys: { `project_id`, `color_1`, `color_2`, `color_3`, `color_4`, `color_5` `name`} | {"posted": true, "id": 26, "name":"stuff", "message": "New Palette creation successful"} | 201 (Created) |
| /api/v1/projects/ | POST | required keys: `name` | {"posted": true, "id": 21,"name": "Another Example", "message": "New Project creation successful"} | 201 ( Created ) |
| /api/v1/projects/:id | PATCH | required keys: { `project.id`, `project.name`} request params = project ID | {"patched": true, "name": "Project Patch Example", "message": "Project ID# 1 has been updated"} | 202(Accepted) |
| /api/v1/palettes/:id | PATCH | required keys: { `key you want to change`, `value` } | {"patched": true, "id": "22","message": "Palette ID# 22 has been updated"} | 202(Accepted) |
| /api/v1/projects/:id | DELETE | N/A | {"deleted": true, "id": 13,"message": "Project ID# 13 has been deleted."} | 202(Accepted) |
| /api/v1/palettes/:id | DELETE | N/A | {"deleted": true, "id": 22, "message": "Palette ID# 22 has been deleted."} | 202(Accepted) |
