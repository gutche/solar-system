function createSphere( )
{
	const radius = 1;
	const widthSegments = 32;
	const heightSegments = 16;
	const phiStart = 0;
	const phiLength = Math.PI * 2;
	const thetaStart = 0;
	const thetaLength = Math.PI;

	const thetaEnd = Math.min( thetaStart + thetaLength, Math.PI );

	let index = 0;
	const grid = [];

	const vertex = vec3.create( );
	const normal = vec3.create( );

	// buffers

	const indices = [];
	const vertices = [];
	const normals = [];
	const uvs = [];

	// generate vertices, normals and uvs

	for ( let iy = 0; iy <= heightSegments; ++iy )
	{

		const verticesRow = [];

		const v = iy / heightSegments;

		// special case for the poles

		let uOffset = 0;

		if ( iy === 0 && thetaStart === 0 )
		{

			uOffset = 0.5 / widthSegments;

		}
		else if ( iy === heightSegments && thetaEnd === Math.PI )
		{

			uOffset = - 0.5 / widthSegments;

		}

		for ( let ix = 0; ix <= widthSegments; ++ix )
		{

			const u = ix / widthSegments;

			// vertex

			vertex[ 0 ] = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
			vertex[ 1 ] = radius * Math.cos( thetaStart + v * thetaLength );
			vertex[ 2 ] = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

			vertices.push( ... vertex );

			// normal
			vec3.copy( normal, vertex );
			vec3.normalize( normal, normal );
			normals.push( ...normal );

			// uv
			uvs.push( u + uOffset, 1 - v );

			verticesRow.push( index++ );

		}

		grid.push( verticesRow );

	}

	// indices

	for ( let iy = 0; iy < heightSegments; ++iy )
	{

		for ( let ix = 0; ix < widthSegments; ++ix )
		{

			const a = grid[ iy ][ ix + 1 ];
			const b = grid[ iy ][ ix ];
			const c = grid[ iy + 1 ][ ix ];
			const d = grid[ iy + 1 ][ ix + 1 ];

			if ( iy !== 0 || thetaStart > 0 ) 
				indices.push( a, b, d );
			if ( iy !== heightSegments - 1 || thetaEnd < Math.PI ) 
				indices.push( b, c, d );
		}
	}

	return {
		vertices: vertices,
		normals: normals,
		texCoords: uvs,
		indices: indices
	}
}



function createRing( )
{
	const innerRadius = 12;
	const outerRadius = 12;
	const thetaSegments = 30;
	const phiSegments = 13;
	const thetaStart = 0;
	const thetaLength = 2.0 * Math.PI;

	const indices = [];
	const vertices = [];
	const normals = [];
	const uvs = [];

	// some helper variables

	let radius = innerRadius;
	const radiusStep = ( ( outerRadius - innerRadius ) / phiSegments );
	const vertex = vec3.create( );
	const uv = glMatrix.vec2.create( );

	// generate vertices, normals and uvs

	for ( let j = 0; j <= phiSegments; ++j )
	{

		for ( let i = 0; i <= thetaSegments; ++i )
		{

			// values are generate from the inside of the ring to the outside

			const segment = thetaStart + i / thetaSegments * thetaLength;

			// vertex

			vertex[ 0 ] = radius * Math.cos( segment );
			vertex[ 1 ] = radius * Math.sin( segment );

			vertices.push( ... vertex );

			// normal

			normals.push( 0, 0, 1 );

			// uv

			uv[ 0 ] = ( vertex[ 0 ] / outerRadius + 1 ) / 2;
			uv[ 1 ] = ( vertex[ 1 ] / outerRadius + 1 ) / 2;

			uvs.push( ...uv );

		}

		// increase the radius for next row of vertices

		radius += radiusStep;

	}

	// indices

	for ( let j = 0; j < phiSegments; ++j )
	{

		const thetaSegmentLevel = j * ( thetaSegments + 1 );

		for ( let i = 0; i < thetaSegments; ++i )
		{

			const segment = i + thetaSegmentLevel;

			const a = segment;
			const b = segment + thetaSegments + 1;
			const c = segment + thetaSegments + 2;
			const d = segment + 1;

			// faces

			indices.push( a, b, d );
			indices.push( b, c, d );

		}

	}

	return {
		vertices: vertices,
		normals: normals,
		texCoords: uvs,
		indices: indices
	}
}