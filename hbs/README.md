# Curso Backend - Lopez Anibal

## Una api de productos

Clonar el proyecto

```sh
git clone https://github.com/lpzanibal/curso-react.git
```

Instalar dependencias

```sh
npm install
```

Inicializar

```sh
npm start
```

## Rutas de la aplicación

| Ruta                | Método | Descripción                                                   |
| ------------------- | ------ | ------------------------------------------------------------- |
| /                   | GET    | UI para cargar productos                                      |
| /api/productos/     | GET    | Devuelve todos los productos                                  |
| /api/productos/:id  | GET    | Devuelve un producto según su id                              |
| /api/productos      | POST   | Recibe y agrega un producto, y lo devuelve con su id asignado |
| /api/productos/:id' | PUT    | Recibe y actualiza un producto según su id                    |
| /api/productos/:id' | DELETE | Elimina un producto según su id                               |
