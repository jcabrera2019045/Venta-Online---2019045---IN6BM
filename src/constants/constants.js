'use strict'

module.exports = Object.freeze({
    // general texts
    clientRole: 'ROL_CLIENTE',
    adminRole: 'ROL_ADMIN',
    requestError: 'Error en la peticion',
    consultError: 'Error en la consulta',
    permissionsError: 'No posees los permisos para hacer esto',
    emptyInformationError: 'Rellene los datos necesarios para crear la peticion',
    default: 'Por defecto',
    addUserError: 'Error al guardar el Usuario',
    cantRegistUser: 'No se ha podido registrar al Usuario',
    serverPort: 'El servidor esta arrancando en el puerto: 3000',
    existingUser: 'Usuario Existente',
    cantIdentifyUser: 'El usuario no se ha podido identificar',
    userCantEntry: 'El usuario no ha podido ingresar',
    addDataError: 'Error al agregar datos',

    // Authenticated texts
    requestHeadersError: 'la peticion no tiene la cabecera de Autorización',
    expiredToken: 'El token ha expirado',
    unvalidToken: 'El token no es válido',

    // Index texts
    defaultAdminName: 'ADMIN',
    defaultAdminPass: '123456',
    defaultAdminRole: 'ROL_ADMIN',

    //User Controller Texts
    updateClientError: 'Error al actualizar cliente',
    roleError: 'El rol solo puede ser ROL_ADMIN o ROL_CLIENTE',
    deleteClientError: 'Error al eliminar cliente',
    updateAdminError: 'No puede modificar a un Administrador',
    deleteAdminError: 'No puede eliminar a un Administrador',
    updateClientAdminError: 'No posee los permisos para cambiar estos parametros',
    existingCart: 'Carrito Existente',
    addCartError: 'Error al crear Carrito',
    cantAddCartError: 'No se ha podido agregar el carrito',

    //Category Controller Texts
    addCategoryError: 'Error al agregar categoria',
    existingCategory: 'Categoria Existente',
    cantAddCategory: 'No se ha podido añadir la categoria',
    updateCategoryError: 'Error al actualizar categoria',
    deleteCategoryError: 'Error al eliminar categoria',
    existingCategory: 'Categoria existente',

    // Product Controller texts
    addProductError: 'Error al agregar producto',
    existingProduct: 'Producto Existente',
    cantAddProduct: 'No se ha podido agregar el producto',
    notFindedProduct: 'No se ha podido encontrar el producto',
    emptyCategory: 'No se han encontrado productos en esta categoria',
    updateProdcutError: 'Error al editar producto',
    deleteCategoryError: 'Error al eliminar producto',
    onlyClientBill: 'Solo los clientes pueden agregar al carrito de compras',
    insuficientProducts: 'Productos insuficientes',
    searchProductError: 'Error al buscar producto',
    emptyProduct: 'No hay existencias',


})