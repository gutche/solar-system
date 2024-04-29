function createContext( id )
{
    var canvas = document.getElementById( id );
    var gl = canvas.getContext( "webgl2" );
    return gl;
} 
