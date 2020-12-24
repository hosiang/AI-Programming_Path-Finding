precision mediump float;
varying vec2 fTexCoord;

#define UI_Button_Release 0
#define UI_Button_Press 1
#define UI_Button_On_Point 2
#define UI_Button_Wait_Process 3

uniform sampler2D sampler2d;
uniform int btnState;

void main()
{
	vec4 color;
	if(btnState == UI_Button_Release){
		color = texture2D(sampler2d, fTexCoord);
	}
	else if(btnState == UI_Button_Press){
		color = texture2D(sampler2d, fTexCoord);
		color.r = color.r * 0.5;
		color.g = color.g * 0.5;
		color.b = color.b * 0.5;
	}
	else if(btnState == UI_Button_On_Point){
		color = texture2D(sampler2d, fTexCoord);
		color.r = color.r * 0.9;
		color.g = color.g * 0.9;
		color.b = color.b * 0.9;
	}
	gl_FragColor = color;
}
