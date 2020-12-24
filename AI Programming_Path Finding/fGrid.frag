precision mediump float;
varying vec2 fTexCoord;

#define NodesListSize 400

#define NodeState_Unsettled 0
#define NodeState_Settled 1

#define DijkstraState_OnFinding 0
#define DijkstraState_NotFound 1
#define DijkstraState_HaveFound 2

uniform vec2 mousePos;
uniform int requestUpdate;
uniform int wallListSize;
uniform int wallIndexList[NodesListSize];
uniform int nodeStateList[NodesListSize];
uniform int parentListSize;
uniform int parentIndexList[NodesListSize];
uniform int openListSize;
uniform int openIndexList[NodesListSize];
uniform int endIndex;
uniform int startIndex;
uniform int findingState;
uniform vec2 spaceSize;
uniform vec2 gridAmount;
uniform vec2 windowSize;
uniform sampler2D sampler2d;

vec4 color;
vec4 colorLine = vec4(0.65, 0.65, 0.65, 1.0);
vec4 colorUnsettled = vec4(0.2, 0.2, 0.2, 1.0);
vec4 colorSettled = vec4(0.8, 1.0, 1.0, 1.0);
vec4 colorSettling = vec4(0.0, 0.701, 0.701, 1.0);
vec4 colorWall = vec4(0.6, 0.4, 1.0, 1.0);
vec4 colorStart = vec4(1.0, 0.313, 0.313, 1.0);
vec4 colorEnd = vec4(0.2, 0.8, 1.0, 1.0);
vec4 colorPath = vec4(1.0, 1.0, 0.6, 1.0);
vec4 colorMouse = vec4(0.9, 0.7, 0.1, 1.0);

bool checkTrigger(float minValue, float maxValue, float value)
{
	if(value > minValue && value < maxValue)
	{
		return true;
		
	}
	else
	{
		return false;
		
	}
	
}

int modi(int x, int y) 
{
    return int(float(x)-float(y)*floor(float(x)/float(y)));
	
}

void update()
{
	float spaceX_nor = spaceSize.x / windowSize.x;
	float spaceY_nor = spaceSize.y / windowSize.y;
	float allSpaceX_nor = (spaceSize.x * (gridAmount.x - 1.0)) / windowSize.x;
	float allSpaceY_nor = (spaceSize.y * (gridAmount.y - 1.0)) / windowSize.y;
	float allNodeSideX_nor = 1.0 - allSpaceX_nor;
	float allNodeSideY_nor = 1.0 - allSpaceY_nor;
	float eachNodeSideX_nor = allNodeSideX_nor / gridAmount.x;
	float eachNodeSideY_nor = allNodeSideY_nor / gridAmount.y;
	
	float mX_nor = (1.0 / windowSize.x) * mousePos.x;
	float squareW_nor = (1.0 / windowSize.x) * 600.0;
	float squareW_Half_nor = squareW_nor * 0.5;
	float windowW_Half_nor = 0.5; //(1.0 / windowSize.x) * (0.5 * windowSize.x);
	float mInSquareX_nor = ((mX_nor * squareW_nor) + (windowW_Half_nor - squareW_Half_nor)) * 2.0;
	
	float mY_nor = (1.0 / windowSize.y) * mousePos.y;
	float squareH_nor = (1.0 / windowSize.y) * 600.0;
	float squareH_Half_nor = squareH_nor * 0.5;
	float windowH_Half_nor = 0.5; //(1.0 / windowSize.x) * (0.5 * windowSize.x);
	float mInSquareY_nor = (mY_nor * squareH_nor) + (windowH_Half_nor - squareH_Half_nor);
	
	
	float mouseLeftX_Min, mouseLeftX_Max, mouseTopY_Min, mouseTopY_Max;
	float mouseRightX_Min, mouseRightX_Max, mouseBottomY_Min, mouseBottomY_Max;
	float nodeX_Min, nodeX_Max, nodeY_Min, nodeY_Max;
	float lineX, lineY;
	
	bool notLine = false;
	
	for (float i = 0.0; i < gridAmount.y; i++)
	{
		lineY = spaceY_nor * i;
	
		nodeY_Min = (eachNodeSideY_nor * i) + lineY;
		nodeY_Max = (eachNodeSideY_nor * (i + 1.0)) + lineY;
		
		for (float j = 0.0; j < gridAmount.x; j++)
		{
			lineX = spaceX_nor * j;
			
			nodeX_Min = (eachNodeSideX_nor * j) + lineX;
			nodeX_Max = (eachNodeSideX_nor * (j + 1.0)) + lineX;
			
			if(checkTrigger(nodeX_Min, nodeX_Max, fTexCoord.x)
				&& checkTrigger(nodeY_Min, nodeY_Max, 1.0 - fTexCoord.y))
			{
				int index = int((i * gridAmount.x) + j);
				
				if( index == startIndex)
				{
					color = colorStart;
				}
				else if( index == endIndex)
				{
					color = colorEnd;
				}
				else
				{
					if(nodeStateList[index] == NodeState_Settled)
					{
						color = colorSettled;
					}
					else if(nodeStateList[index] == NodeState_Unsettled)
					{	
						color = colorUnsettled;
					}
					for	(int k=0; k < openListSize; k++)
					{
						if(openIndexList[k] == index)
						{
							color = colorSettling;
							break;
						}
					}

				}
				
				for (int k=0; k < wallListSize; k++)
				{
					if( wallIndexList[k] == index)
					{
						color = colorWall;
						break;
					}
					
				}
				
				if(findingState == DijkstraState_HaveFound)
				{
					for (int k=0; k < (parentListSize-1); k++)
					{
						if(parentIndexList[k] == index)
						{
							color = colorPath;
							
						}
					}
					
				}
				
				if(i == mousePos.y
				&& j == mousePos.x)
				{
					mouseLeftX_Min = nodeX_Min;
					mouseLeftX_Max = nodeX_Max - (eachNodeSideX_nor * 0.75);
					mouseTopY_Min = nodeY_Min;
					mouseTopY_Max = nodeY_Max - (eachNodeSideY_nor * 0.75);
					mouseRightX_Min = nodeX_Min + (eachNodeSideX_nor * 0.75);
					mouseRightX_Max = nodeX_Max;
					mouseBottomY_Min = nodeY_Min + (eachNodeSideY_nor * 0.75);
					mouseBottomY_Max = nodeY_Max;
					
					if( (checkTrigger(mouseLeftX_Min, mouseLeftX_Max, fTexCoord.x)
							&& checkTrigger(mouseTopY_Min, mouseTopY_Max, 1.0 - fTexCoord.y))
						|| (checkTrigger(mouseRightX_Min, mouseRightX_Max, fTexCoord.x)
							&& checkTrigger(mouseTopY_Min, mouseTopY_Max, 1.0 - fTexCoord.y))
						|| (checkTrigger(mouseLeftX_Min, mouseLeftX_Max, fTexCoord.x)
							&& checkTrigger(mouseBottomY_Min, mouseBottomY_Max, 1.0 - fTexCoord.y))
						|| (checkTrigger(mouseRightX_Min, mouseRightX_Max, fTexCoord.x)
							&& checkTrigger(mouseBottomY_Min, mouseBottomY_Max, 1.0 - fTexCoord.y)) )
					{
						color = colorMouse;
						
					}
					
				}
				
				notLine = true;
				
				i = gridAmount.y;
				j = gridAmount.x;
				
			}
			
		}
		
	}
	
	if(!notLine)
	{
		color = colorLine;
		
	}
	
}

void main()
{
	if(requestUpdate == 1)
	{	
		update();
		
	}
	else
	{
		color = texture2D(sampler2d, fTexCoord);
		
	}

	gl_FragColor = color; //texture2D(sampler2d, fTexCoord);
	
}
