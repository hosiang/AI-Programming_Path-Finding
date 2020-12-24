precision mediump float;
varying vec2 fTexCoord;

uniform sampler2D sampler2d;

void main()
{
	gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);//texture2D(sampler2d, fTexCoord);
}
