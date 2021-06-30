/***********************************\
|            PLUGIN DATA            |
\***********************************/

var plugin_data = {
	id: 'geenium_bedrock_entity_helper',
	title: 'Bedrock Entity Generator',
	icon: 'pets',
	author: 'Geenium',
	description: 'Helps making Bedrock entity models',
	tags: ["Minecraft: Bedrock Edition"],
	version: '0.3.0',
	variant: 'both'
}

/***********************************\
|        ADDING NEW FUNCTIONS       |
\***********************************/

//New addCube function allows you to specify the name and position properties of the cube
addEntityCube = function(name, from, to, uv, inflate, mirror) {
	var added_cube = new Cube({name: name, from: from, to: to, uv_offset: uv, shade: (mirror != undefined)}).addTo(Group.all.last()).init()

	if (inflate) {
		added_cube.inflate = inflate
	}
}

getEntityName = function(entity, parent) {
	var parentEntity = ''
	switch (entity) {
		case 'enderman':
		case 'zombie':
		case 'pigzombie':
		case 'zombie.villager':
		case 'vex':
			parentEntity = ':geometry.humanoid'
			break
		case 'cow':
		case 'sheep.sheared':
		case 'pig':
			parentEntity = ':geometry.quadruped'
			break
		case 'evoker':
		case 'villager.witch':
			parentEntity = ':geometry.villager'
			break
		case 'zombie.husk':
		case 'skeleton':
			parentEntity = ':geometry.zombie'
			break
		case 'skeleton.wither':
		case 'skeleton.stray':
			parentEntity = ':geometry.skeleton'
			break
		case 'creeper.charged':
			parentEntity = ':geometry.creeper'
			break
		case 'pigzombie.baby':
			parentEntity = ':geometry.pigzombie'
			break
		case 'mooshroom':
			parentEntity = ':geometry.cow'
			break
		case 'sheep':
			parentEntity = ':geometry.sheep.sheared'
			break
		case 'witherBoss.armor':
			parentEntity = ':geometry.witherBoss'
	}
	entity = 'geometry.' + entity

	if (parent) return entity + parentEntity
	return entity
}

//Sets the base texture size for the project for the default entity texture
//This is used in calculating the UVs of the entity
changeTextureSizes = function(entity) {
	switch (entity) {
		case 'dragon':
		case 'dragon_head':
			Project.texture_width = 256
			Project.texture_height = 256
			break
		case 'horse':
		case 'irongolem':
			Project.texture_width = 128
			Project.texture_height = 128
			break
		case 'llama':
		case 'polarbear':
		case 'boat':
			Project.texture_width = 128
			Project.texture_height = 64
			break
		case 'villager.witch':
			Project.texture_width = 64
			Project.texture_height = 128
			break
		case 'llamaspit':
		case 'shulker':
		case 'zombie.villager':
		case 'evoker':
		case 'vex':
		case 'vindicator':
		case 'guardian':
		case 'witherBoss':
		case 'armor_stand':
		case 'bed':
		case 'player_head':
		case 'villager':
		case 'snowgolem':
		case 'sheep':
		case 'sheep.sheared':
		case 'bat':
		case 'dolphin':
		case 'horse.v2':
		case 'zombie.drowned':
			Project.texture_width = 64
			Project.texture_height = 64
			break
		case 'parrot':
		case 'tropicalfish_a':
		case 'tropicalfish_b':
		case 'trident':
		case 'cod':
		case 'pufferfish.small':
		case 'pufferfish.mid':
		case 'pufferfish.large':
		case 'salmon':
			Project.texture_width = 32
			Project.texture_height = 32
			break
		default:
			Project.texture_width = 64
			Project.texture_height = 32
	}
}

createBones = function(entity, add_cubes) {
	//These entities parent all their bones from other entities
	//Means I don't have to define the exact same entity repeatedly
	switch (entity) {
		case 'zombie':
		case 'zombie.husk':
		case 'pigzombie.baby':
			entity = 'humanoid'
			break
		case 'skeleton.wither':
		case 'skeleton.stray':
			entity = 'skeleton'
			break
		case 'mooshroom':
			entity = 'cow'
			break
		case 'mob_head':
			entity = 'player_head'
			break
	}

	var bones = entity_bones[entity]
	//Iterates over each bone from the entity defined in entity_bones
	Object.keys(bones).forEach(function(bone_name) {
		//Copies the list to a new variable so the original list is not altered
		cubeValues = bones[bone_name].slice()
		//Removes the first element from the list, which is the rotation values
		rotationValues = cubeValues.shift()

		//Creates a new group for the bone
		bone_group = new Group(bone_name).init();
		bone_group.origin = rotationValues[0]
		bone_group.shade = false
		//Sets the selected group to the newly created bone
		selected_group = bone_group

		//Cubes are added first, so all added cubes can be instantly added to a group
		if (add_cubes) {
			cubeValues.forEach(function(cubes) {
				addEntityCube(bone_name, ...cubes)
			})
		}

		if (rotationValues.length > 1) {
			bone_group.rotation = rotationValues[1]
		}
	})
}

/***********************************\
|            BONE VALUES            |
\***********************************/

//Defines bones that are repeated multiple times
var repeat={blazeRod:[[[0,24,0]],[[0,16,0],[2,24,2],[0,16]]],dragon:{wingtip:[[[-56,24,0]],[[-112,22,-2],[-56,26,2],[112,136]],[[-112,24,2],[-56,24,58],[-56,144]]],rearlegtip:[[[0,-8,-4]],[[-6,-38,-4],[6,-6,8],[196,0]]],frontlegtip:[[[0,4,-1]],[[-3,-19,-4],[3,5,2],[226,138]]],rearfoot:[[[0,-7,4]],[[-9,-13,-16],[9,-7,8],[112,0]]],frontfoot:[[[0,1,0]],[[-4,-3,-12],[4,1,4],[144,104]]],jaw:[[[0,20,-8]],[[-6,16,-24],[6,20,-8],[176,65]]]},slime:{eye0:[[[0,24,0]],[[-3.3,4,-3.5],[-1.3,6,-1.5],[32,0]]],eye1:[[[0,24,0]],[[1.3,4,-3.5],[3.3,6,-1.5],[32,4]]],mouth:[[[0,24,0]],[[0,2,-3.5],[1,3,-2.5],[32,8]]]},humanoid:{head:[[[0,24,0]],[[-4,24,-4],[4,32,4],[0,0]]],body:[[[0,24,0]],[[-4,12,-2],[4,24,2],[16,16]]],leftArm:[[[5,22,0]],[[4,12,-2],[8,24,2],[40,16],0,1]],rightArm:[[[-5,22,0]],[[-8,12,-2],[-4,24,2],[40,16]]],leftLeg:[[[1.9,12,0]],[[-0.1,0,-2],[3.9,12,2],[0,16],0,1]],rightLeg:[[[-1.9,12,0]],[[-3.9,0,-2],[0.1,12,2],[0,16]]]},snowgolemArm:[[[0,18,0]],[[-1,16,-1],[11,18,1],[32,0],-0.5]],guardianSpike:[[[0,24,0]],[[-1,19.5,-1],[1,28.5,1],[0,0]]],villager:{head:[[[0,24,0]],[[-4,24,-4],[4,34,4],[0,0]]],nose:[[[0,26,0]],[[-1,23,-6],[1,27,-4],[24,0]]],body:[[[0,24,0]],[[-4,12,-3],[4,24,3],[16,20]],[[-4,6,-3],[4,24,3],[0,38],0.5]],leg0:[[[-2,12,0]],[[-4,0,-2],[0,12,2],[0,22]]],leg1:[[[2,12,0]],[[0,0,-2],[4,12,2],[0,22]]],arms:[[[0,22,0]],[[-4,16,-2],[4,20,2],[40,38]],[[-8,16,-2],[-4,24,2],[44,22]],[[4,16,-2],[8,24,2],[44,22]]]},zombieVillagerLeftLeg:[[[2,12,0]],[[0,0,-2],[4,12,2],[0,22],0,1]],illager:{rightarm:[[[-5,22,0]],[[-8,12,-2],[-4,24,2],[40,46]]],leftarm:[[[5,22,0]],[[4,12,-2],[8,24,2],[40,46],0,1]]}}

//These are all the hard coded entity bone values
var entity_bones={chicken:{head:[[[0,9,-4]],[[-2,9,-6],[2,15,-3],[0,0]]],beak:[[[0,9,-4]],[[-2,11,-8],[2,13,-6],[14,0]]],comb:[[[0,9,-4]],[[-1,9,-7],[1,11,-5],[14,4]]],body:[[[0,8,0]],[[-3,4,-3],[3,12,3],[0,9]]],leg0:[[[-2,5,1]],[[-3,0,-2],[0,5,1],[26,0]]],leg1:[[[1,5,1]],[[0,0,-2],[3,5,1],[26,0]]],wing0:[[[-3,11,0]],[[-4,7,-3],[-3,11,3],[24,13]]],wing1:[[[3,11,0]],[[3,7,-3],[4,11,3],[24,13]]]},blaze:{upperBodyParts0:repeat.blazeRod,upperBodyParts1:repeat.blazeRod,upperBodyParts2:repeat.blazeRod,upperBodyParts3:repeat.blazeRod,upperBodyParts4:repeat.blazeRod,upperBodyParts5:repeat.blazeRod,upperBodyParts6:repeat.blazeRod,upperBodyParts7:repeat.blazeRod,upperBodyParts8:repeat.blazeRod,upperBodyParts9:repeat.blazeRod,upperBodyParts10:repeat.blazeRod,upperBodyParts11:repeat.blazeRod,head:[[[0,24,0]],[[-4,20,-4],[4,28,4],[0,0]]]},llamaspit:{body:[[[0,24,0]],[[-4,22,0],[-2,24,2],[0,0]],[[0,26,0],[2,28,2],[0,0]],[[0,22,-4],[2,24,-2],[0,0]],[[0,22,0],[2,24,2],[0,0]],[[2,22,0],[4,24,2],[0,0]],[[0,20,0],[2,22,2],[0,0]],[[0,22,2],[2,24,4],[0,0]]]},llama:{head:[[[0,17,-6]],[[-2,27,-16],[2,31,-7],[0,0]],[[-4,15,-12],[4,33,-6],[0,14]],[[-4,33,-10],[-1,36,-8],[17,0]],[[1,33,-10],[4,36,-8],[17,0]]],chest1:[[[-8.5,21,3],[0,90,0]],[[-11.5,13,3],[-3.5,21,6],[45,28]]],chest2:[[[5.5,21,3],[0,90,0]],[[2.5,13,3],[10.5,21,6],[45,41]]],body:[[[0,19,2]],[[-6,11,-5],[6,29,5],[29,0]]],leg0:[[[-3.5,14,6]],[[-5.5,0,4],[-1.5,14,8],[29,29]]],leg1:[[[3.5,14,6]],[[1.5,0,4],[5.5,14,8],[29,29]]],leg2:[[[-3.5,14,-5]],[[-5.5,0,-7],[-1.5,14,-3],[29,29]]],leg3:[[[3.5,14,-5]],[[1.5,0,-7],[5.5,14,-3],[29,29]]]},dragon:{head:[[[0,24,0]],[[-6,20,-24],[6,25,-8],[176,44]],[[-8,16,-10],[8,32,6],[112,30]],[[-5,32,-4],[-3,36,2],[0,0]],[[-5,25,-22],[-3,27,-18],[112,0]],[[3,32,-4],[5,36,2],[0,0]],[[3,25,-22],[5,27,-18],[112,0],0,1]],jaw:repeat.dragon.jaw,neck:[[[0,24,0]],[[-5,19,-5],[5,29,5],[192,104]],[[-1,29,-3],[1,33,3],[48,0]]],body:[[[0,20,8]],[[-12,-4,-8],[12,20,56],[0,0]],[[-1,20,-2],[1,26,10],[220,53]],[[-1,20,18],[1,26,30],[220,53]],[[-1,20,38],[1,26,50],[220,53]]],wing:[[[-12,19,2]],[[-68,15,-2],[-12,23,6],[112,88]],[[-68,19,4],[-12,19,60],[-56,88]]],wingtip:repeat.dragon.wingtip,wing1:[[[12,19,2]],[[-44,15,-2],[12,23,6],[112,88]],[[-44,19,4],[12,19,60],[-56,88]]],wingtip1:repeat.dragon.wingtip,rearleg:[[[-16,8,42]],[[-24,-20,34],[-8,12,50],[0,0]]],rearleg1:[[[16,8,42]],[[8,-20,34],[24,12,50],[0,0]]],frontleg:[[[-12,4,2]],[[-16,-16,-2],[-8,8,6],[112,104]]],frontleg1:[[[12,4,2]],[[8,-16,-2],[16,8,6],[112,104]]],rearlegtip:repeat.dragon.rearlegtip,rearlegtip1:repeat.dragon.rearlegtip,frontlegtip:repeat.dragon.frontlegtip,frontlegtip1:repeat.dragon.frontlegtip,rearfoot:repeat.dragon.rearfoot,rearfoot1:repeat.dragon.rearfoot,frontfoot:repeat.dragon.frontfoot,frontfoot1:repeat.dragon.frontfoot},ghast:{tentacles_0:[[[-3.8,1,-5]],[[-4.8,-8,-6],[-2.8,1,-4],[0,0]]],tentacles_1:[[[1.3,1,-5]],[[0.3,-10,-6],[2.3,1,-4],[0,0]]],tentacles_2:[[[6.3,1,-5]],[[5.3,-7,-6],[7.3,1,-4],[0,0]]],tentacles_3:[[[-6.3,1,0]],[[-7.3,-8,-1],[-5.3,1,1],[0,0]]],tentacles_4:[[[-1.3,1,0]],[[-2.3,-12,-1],[-0.3,1,1],[0,0]]],tentacles_5:[[[3.8,1,0]],[[2.8,-10,-1],[4.8,1,1],[0,0]]],tentacles_6:[[[-3.8,1,5]],[[-4.8,-11,4],[-2.8,1,6],[0,0]]],tentacles_7:[[[1.3,1,5]],[[0.3,-11,4],[2.3,1,6],[0,0]]],tentacles_8:[[[6.3,1,5]],[[5.3,-12,4],[7.3,1,6],[0,0]]],body:[[[0,8,0]],[[-8,0,-8],[8,16,8],[0,0]]]},slime:{cube:[[[0,24,0]],[[-3,1,-3],[3,7,3],[0,16]]],eye0:repeat.slime.eye0,eye1:repeat.slime.eye1,mouth:repeat.slime.mouth},'slime.armor':{cube:[[[0,24,0]],[[-4,0,-4],[4,8,4],[0,0]]],eye0:repeat.slime.eye0,eye1:repeat.slime.eye1,mouth:repeat.slime.mouth},lavaslime:{bodyCube_0:[[[0,24,0]],[[-4,7,-4],[4,8,4],[0,0]]],bodyCube_1:[[[0,24,0]],[[-4,6,-4],[4,7,4],[0,1]]],bodyCube_2:[[[0,24,0]],[[-4,5,-4],[4,6,4],[24,10]]],bodyCube_3:[[[0,24,0]],[[-4,4,-4],[4,5,4],[24,19]]],bodyCube_4:[[[0,24,0]],[[-4,3,-4],[4,4,4],[0,4]]],bodyCube_5:[[[0,24,0]],[[-4,2,-4],[4,3,4],[0,5]]],bodyCube_6:[[[0,24,0]],[[-4,1,-4],[4,2,4],[0,6]]],bodyCube_7:[[[0,24,0]],[[-4,0,-4],[4,1,4],[0,7]]],insideCube:[[[0,24,0]],[[-2,2,-2],[2,6,2],[0,16]]]},silverfish:{bodyPart_0:[[[0,2,-3.5]],[[-1.5,0,-4.5],[1.5,2,-2.5],[0,0]]],bodyPart_1:[[[0,3,-1.5]],[[-2,0,-2.5],[2,3,-0.5],[0,4]]],bodyPart_2:[[[0,4,1]],[[-3,0,-0.5],[3,4,2.5],[0,9]]],bodyPart_3:[[[0,3,4]],[[-1.5,0,2.5],[1.5,3,5.5],[0,16]]],bodyPart_4:[[[0,2,7]],[[-1,0,5.5],[1,2,8.5],[0,22]]],bodyPart_5:[[[0,1,9.5]],[[-1,0,8.5],[1,1,10.5],[11,0]]],bodyPart_6:[[[0,1,11.5]],[[-0.5,0,10.5],[0.5,1,12.5],[13,4]]],bodyLayer_0:[[[0,8,1]],[[-5,0,-0.5],[5,8,2.5],[20,0]]],bodyLayer_1:[[[0,4,7]],[[-3,0,5.5],[3,4,8.5],[20,11]]],bodyLayer_2:[[[0,5,-1.5]],[[-3,0,-3],[3,5,-1],[20,18]]]},shulker:{lid:[[[0,0,0]],[[-8,4,-8],[8,16,8],[0,0]]],base:[[[0,0,0]],[[-8,0,-8],[8,8,8],[0,28]]],head:[[[0,12,0]],[[-3,6,-3],[3,12,3],[0,52]]]},rabbit:{rearFootLeft:[[[3,6.5,3.7]],[[2,0,0],[4,1,7],[8,24],0,1]],rearFootRight:[[[-3,6.5,3.7]],[[-4,0,0],[-2,1,7],[26,24],0,1]],haunchLeft:[[[3,6.5,3.7],[20,0,0]],[[2,2.5,3.7],[4,6.5,8.7],[16,15],0,1]],haunchRight:[[[-3,6.5,3.7],[20,0,0]],[[-4,2.5,3.7],[-2,6.5,8.7],[30,15],0,1]],body:[[[0,5,8],[20,0,0]],[[-3,2,-2],[3,7,8],[0,0],0,1]],frontLegLeft:[[[3,7,-1],[10,0,0]],[[2,0,-2],[4,7,0],[8,15],0,1]],frontLegRight:[[[-3,7,-1],[10,0,0]],[[-4,0,-2],[-2,7,0],[0,15],0,1]],head:[[[0,8,-1]],[[-2.5,8,-6],[2.5,12,-1],[32,0],0,1]],earRight:[[[0,8,-1],[0,-15,0]],[[-2.5,12,-2],[-0.5,17,-1],[52,0],0,1]],earLeft:[[[0,8,-1],[0,15,0]],[[0.5,12,-2],[2.5,17,-1],[58,0],0,1]],tail:[[[0,4,7],[20,0,0]],[[-1.5,2.5,7],[1.5,5.5,9],[52,6],0,1]],nose:[[[0,8,-1]],[[-0.5,9.5,-6.5],[0.5,10.5,-5.5],[32,9],0,1]]},'horse.v2':{Body:[[[0,13,9]],[[-5,11,-11],[5,21,11],[0,32]]],TailA:[[[0,20,11],[-30,0,0]],[[-1.5,6,9],[1.5,20,13],[42,36]]],Leg1A:[[[3,11,9]],[[1,0,7],[5,11,11],[48,21],0,1]],Leg2A:[[[-3,11,9]],[[-5,0,7],[-1,11,11],[48,21]]],Leg3A:[[[3,11,-9]],[[1,0,-11],[5,11,-7],[48,21],0,1]],Leg4A:[[[-3,11,-9]],[[-5,0,-11],[-1,11,-7],[48,21]]],Head:[[[0,28,-11],[-30,0,0]],[[-3,28,-11],[3,33,-4],[0,13]]],UMouth:[[[0,28,-11],[-30,0,0]],[[-2,28,-16],[2,33,-11],[0,25]]],Ear1:[[[0,17,-8],[-30,0,5]],[[-0.5,32,-5.01],[1.5,35,-4.01],[19,16],0,1]],Ear2:[[[0,17,-8],[-30,0,-5]],[[-1.5,32,-5.01],[0.5,35,-4.01],[19,16]]],MuleEarL:[[[0,17,-8],[-30,0,15]],[[-3,32,-5.01],[-1,39,-4.01],[0,12],0,1]],MuleEarR:[[[0,17,-8],[-30,0,-15]],[[1,32,-5.01],[3,39,-4.01],[0,12]]],Neck:[[[0,17,-8],[-30,0,0]],[[-2,16,-11],[2,28,-4],[0,35]]],Bag1:[[[-5,21,11],[0,-90,0]],[[-14,13,11],[-6,21,14],[26,21]]],Bag2:[[[5,21,11],[0,90,0]],[[6,13,11],[14,21,14],[26,21],0,1]],Saddle:[[[0,22,2]],[[-5,12,-3.5],[5,21,5.5],[26,0],0.5]],SaddleMouthL:[[[0,17,-8],[-30,0,0]],[[2,29,-14],[3,31,-12],[29,5]]],SaddleMouthR:[[[0,17,-8],[-30,0,0]],[[-3,29,-14],[-2,31,-12],[29,5]]],SaddleMouthLine:[[[0,17,-8]],[[3.1,24,-19.5],[3.1,27,-3.5],[32,2]]],SaddleMouthLineR:[[[0,17,-8]],[[-3.1,24,-19.5],[-3.1,27,-3.5],[32,2]]],Mane:[[[0,17,-8],[-30,0,0]],[[-1,17,-4],[1,33,-2],[56,36]]],HeadSaddle:[[[0,17,-8],[-30,0,0]],[[-2,28,-13],[2,33,-11],[19,0]],[[-3,28,-11],[3,33,-4],[0,0],0.25]]},horse:{Body:[[[0,13,9]],[[-5,11,-10],[5,21,14],[0,34]]],TailA:[[[0,21,14],[65,0,0]],[[-1,20,14],[1,22,17],[44,0]]],TailB:[[[0,21,14],[65,0,0]],[[-1.5,19,17],[1.5,23,24],[38,7]]],TailC:[[[0,21,14],[80.34,0,0]],[[-1.5,21.5,23],[1.5,25.5,30],[24,3]]],Leg1A:[[[4,15,11]],[[1.5,8,8.5],[5.5,17,13.5],[78,29]]],Leg1B:[[[4,8,11]],[[2,3,9.5],[5,8,12.5],[78,43]]],Leg1C:[[[4,8,11]],[[1.5,-0.1,9],[5.5,2.9,13],[78,51]]],Leg2A:[[[-4,15,11]],[[-5.5,8,8.5],[-1.5,17,13.5],[96,29]]],Leg2B:[[[-4,8,11]],[[-5,3,9.5],[-2,8,12.5],[96,43]]],Leg2C:[[[-4,8,11]],[[-5.5,-0.1,9],[-1.5,2.9,13],[96,51]]],Leg3A:[[[4,15,-8]],[[2.1,8,-10.1],[5.1,16,-6.1],[44,29]]],Leg3B:[[[4,8,-8]],[[2.1,3,-9.6],[5.1,8,-6.6],[44,41]]],Leg3C:[[[4,8,-8]],[[1.6,-0.1,-10.1],[5.6,2.9,-6.1],[44,51]]],Leg4A:[[[-4,15,-8]],[[-5.1,8,-10.1],[-2.1,16,-6.1],[60,29]]],Leg4B:[[[-4,8,-8]],[[-5.1,3,-9.6],[-2.1,8,-6.6],[60,41]]],Leg4C:[[[-4,8,-8]],[[-5.6,-0.1,-10.1],[-1.6,2.9,-6.1],[60,51]]],Head:[[[0,20,-10],[-30,0,0]],[[-2.5,25,-11.5],[2.5,30,-4.5],[0,0]]],UMouth:[[[0,20.05,-10],[-30,0,0]],[[-2,27.05,-17],[2,30.05,-11],[24,18]]],LMouth:[[[0,20,-10],[-30,0,0]],[[-2,25,-16.5],[2,27,-11.5],[24,27]]],Ear1:[[[0,20,-10],[-30,0,0]],[[0.45,29,-6],[2.45,32,-5],[0,0]]],Ear2:[[[0,20,-10],[-30,0,0]],[[-2.45,29,-6],[-0.45,32,-5],[0,0]]],MuleEarL:[[[0,20,-10],[-30,0,15]],[[-2,29,-6],[0,36,-5],[0,12]]],MuleEarR:[[[0,20,-10],[-30,0,-15]],[[0,29,-6],[2,36,-5],[0,12]]],Neck:[[[0,20,-10],[-30,0,0]],[[-2.05,15.8,-12],[1.95,29.8,-4],[0,12]]],Bag1:[[[-7.5,21,10],[0,-90,0]],[[-10.5,13,10],[-2.5,21,13],[0,34]]],Bag2:[[[4.5,21,10],[0,90,0]],[[1.5,13,10],[9.5,21,13],[0,47]]],Saddle:[[[0,22,2]],[[-5,21,-1],[5,22,7],[80,0]]],SaddleB:[[[0,22,2]],[[-1.5,22,-1],[1.5,23,1],[106,9]]],SaddleC:[[[0,22,2]],[[-4,22,5],[4,23,7],[80,9]]],SaddleL2:[[[5,21,2]],[[4.5,13,1],[5.5,15,3],[74,0]]],SaddleL:[[[5,21,2]],[[4.5,15,1.5],[5.5,21,2.5],[70,0]]],SaddleR2:[[[-5,21,2]],[[-5.5,13,1],[-4.5,15,3],[74,4]]],SaddleR:[[[-5,21,2]],[[-5.5,15,1.5],[-4.5,21,2.5],[80,0]]],SaddleMouthL:[[[0,20,-10],[-30,0,0]],[[1.5,26,-14],[2.5,28,-12],[74,13]]],SaddleMouthR:[[[0,20,-10],[-30,0,0]],[[-2.5,26,-14],[-1.5,28,-12],[74,13]]],SaddleMouthLine:[[[0,20,-10]],[[2.6,23,-16],[2.6,26,0],[44,10]]],SaddleMouthLineR:[[[0,20,-10]],[[-2.6,23,-16],[-2.6,26,0],[44,5]]],Mane:[[[0,20,-10],[-30,0,0]],[[-1,15.5,-5],[1,31.5,-1],[58,0]]],HeadSaddle:[[[0,20,-10],[-30,0,0]],[[-2.5,25.1,-17],[2.5,30.1,-5],[80,12],0.05]]},humanoid:repeat.humanoid,creeper:{body:[[[0,0,0]],[[-4,6,-2],[4,18,2],[16,16]]],head:[[[0,18,0]],[[-4,18,-4],[4,26,4],[0,0]]],leg0:[[[-2,6,4]],[[-4,0,2],[0,6,6],[0,16]]],leg1:[[[2,6,4]],[[0,0,2],[4,6,6],[0,16]]],leg2:[[[-2,6,-4]],[[-4,0,-6],[0,6,-2],[0,16]]],leg3:[[[2,6,-4]],[[0,0,-6],[4,6,-2],[0,16]]]},'zombie.drowned':{body:repeat.humanoid.body,jacket:[[[0,24,0]],[[-4,12,-2],[4,24,2],[16,32],0.5]],head:[[[0,24,0]],[[-4,24,-4],[4,32,4],[0,0],0.5]],hat:[[[0,24,0]],[[-4,24,-4],[4,32,4],[32,0],1]],rightArm:[[[-5,22,0]],[[-7,12,-2],[-3,24,2],[0,16]]],leftArm:repeat.humanoid.leftArm,rightSleeve:[[[-5,22,0]],[[-7,12,-2],[-3,24,2],[48,48],0.5]],leftSleeve:[[[5,22,0]],[[4,12,-2],[8,24,2],[40,32],0.5,1]],rightLeg:[[[-1.9,12,0]],[[-4.05,0,-2],[-0.05,12,2],[16,48]]],leftLeg:[[[1.9,12,0]],[[0.05,0,-2],[4.05,12,2],[32,48],0,1]],rightPants:[[[-1.9,12,0]],[[-4.25,0,-2],[-0.25,12,2],[0,48],0.25]],leftPants:[[[1.9,12,0]],[[0.25,0,-2],[4.25,12,2],[0,32],0.25,1]]},squid:{body:[[[0,0,0]],[[-6,-8,-6],[6,8,6],[0,0]]],tentacle1:[[[5,-7,0],[0,90,0]],[[4,-25,-1],[6,-7,1],[48,0]]],tentacle2:[[[3.5,-7,3.5],[0,45,0]],[[2.5,-25,2.5],[4.5,-7,4.5],[48,0]]],tentacle3:[[[0,-7,5]],[[-1,-25,4],[1,-7,6],[48,0]]],tentacle4:[[[-3.5,-7,3.5],[0,-45,0]],[[-4.5,-25,2.5],[-2.5,-7,4.5],[48,0]]],tentacle5:[[[-5,-7,0],[0,-90,0]],[[-6,-25,-1],[-4,-7,1],[48,0]]],tentacle6:[[[-3.5,-7,-3.5],[0,-135,0]],[[-4.5,-25,-4.5],[-2.5,-7,-2.5],[48,0]]],tentacle7:[[[0,-7,-5],[0,-180,0]],[[-1,-25,-6],[1,-7,-4],[48,0]]],tentacle8:[[[3.5,-7,-3.5],[0,-225,0]],[[2.5,-25,-4.5],[4.5,-7,-2.5],[48,0]]]},spider:{head:[[[0,9,-3]],[[-4,5,-11],[4,13,-3],[32,4]]],body0:[[[0,9,0]],[[-3,6,-3],[3,12,3],[0,0]]],body1:[[[0,9,9]],[[-5,5,3],[5,13,15],[0,12]]],leg0:[[[-4,9,2]],[[-19,8,1],[-3,10,3],[18,0]]],leg1:[[[4,9,2]],[[3,8,1],[19,10,3],[18,0]]],leg2:[[[-4,9,1]],[[-19,8,0],[-3,10,2],[18,0]]],leg3:[[[4,9,1]],[[3,8,0],[19,10,2],[18,0]]],leg4:[[[-4,9,0]],[[-19,8,-1],[-3,10,1],[18,0]]],leg5:[[[4,9,0]],[[3,8,-1],[19,10,1],[18,0]]],leg6:[[[-4,9,-1]],[[-19,8,-2],[-3,10,0],[18,0]]],leg7:[[[4,9,-1]],[[3,8,-2],[19,10,0],[18,0]]]},cow:{body:[[[0,19,2]],[[-6,11,-5],[6,29,5],[18,4]],[[-2,11,-6],[2,17,-5],[52,0]]],head:[[[0,20,-8]],[[-4,16,-14],[4,24,-8],[0,0]],[[-5,22,-12],[-4,25,-11],[22,0]],[[4,22,-12],[5,25,-11],[22,0]]],leg0:[[[-4,12,7]],[[-6,0,5],[-2,12,9],[0,16]]],leg1:[[[4,12,7]],[[2,0,5],[6,12,9],[0,16]]],leg2:[[[-4,12,-6]],[[-6,0,-7],[-2,12,-3],[0,16]]],leg3:[[[4,12,-6]],[[2,0,-7],[6,12,-3],[0,16]]]},bat:{head:[[[0,24,0]],[[-3,21,-3],[3,27,3],[0,0]]],rightEar:[[[0,24,0]],[[-4,26,-2],[-1,30,-1],[24,0]]],leftEar:[[[0,24,0]],[[1,26,-2],[4,30,-1],[24,0],0,1]],body:[[[0,24,0]],[[-3,8,-3],[3,20,3],[0,16]],[[-5,-8,0],[5,8,1],[0,34]]],rightWing:[[[0,24,0]],[[-12,7,1.5],[-2,23,2.5],[42,0]]],rightWingTip:[[[-12,23,1.5]],[[-20,10,1.5],[-12,22,2.5],[24,16]]],leftWing:[[[0,24,0]],[[2,7,1.5],[12,23,2.5],[42,0],0,1]],leftWingTip:[[[12,23,1.5]],[[12,10,1.5],[20,22,2.5],[24,16],0,1]]},dolphin:{head:[[[0,0,-3]],[[-4,0,-9],[4,7,-3],[0,0]]],body:[[[0,0,-3]],[[-4,0,-3],[4,7,10],[0,13]]],tail:[[[0,2.5,11]],[[-2,0,10],[2,5,21],[0,33]]],tail_fin:[[[0,2.5,20]],[[-5,2,19],[5,3,25],[0,49]]],back_fin:[[[0,7,4]],[[-0.5,7,3],[0.5,12,7],[29,0]]],left_fin:[[[3,1,-1]],[[3,1,-2],[11,2,2],[40,0]]],right_fin:[[[-3,1,-1]],[[-11,1,-2],[-3,2,2],[40,6]]],nose:[[[0,0,-13]],[[-1,0,-13],[1,2,-9],[0,13]]]},irongolem:{body:[[[0,31,0]],[[-9,21,-6],[9,33,5],[0,40]],[[-4.5,16,-3],[4.5,21,3],[0,70],0.5]],head:[[[0,31,-2]],[[-4,33,-7.5],[4,43,0.5],[0,0]],[[-1,32,-9.5],[1,36,-7.5],[24,0]]],arm0:[[[0,31,0]],[[-13,3.5,-3],[-9,33.5,3],[60,21]]],arm1:[[[0,31,0]],[[9,3.5,-3],[13,33.5,3],[60,58]]],leg0:[[[-4,13,0]],[[-7.5,0,-3],[-1.5,16,2],[37,0]]],leg1:[[[5,13,0]],[[1.5,0,-3],[7.5,16,2],[60,0],0,1]]},snowgolem:{head:[[[0,20,0]],[[-4,20,-4],[4,28,4],[0,0],-0.5]],arm1:repeat.snowgolemArm,arm2:repeat.snowgolemArm,piece1:[[[0,11,0]],[[-5,11,-5],[5,21,5],[0,16],-0.5]],piece2:[[[0,0,0]],[[-6,0,-6],[6,12,6],[0,36],-0.5]]},vindicator:{head:repeat.villager.head,nose:repeat.villager.nose,body:repeat.villager.body,arms:repeat.villager.arms,leg0:repeat.villager.leg0,leg1:repeat.zombieVillagerLeftLeg,rightarm:repeat.illager.rightarm,leftarm:repeat.illager.leftarm},wolf:{head:[[[-1,10.5,-7]],[[-4,7.5,-9],[2,13.5,-5],[0,0]],[[-4,13.5,-7],[-2,15.5,-6],[16,14]],[[0,13.5,-7],[2,15.5,-6],[16,14]],[[-2.5,7.52,-12],[0.5,10.52,-8],[0,10]]],body:[[[0,10,2]],[[-4,3,-1],[2,12,5],[18,14]]],upperBody:[[[-1,10,2]],[[-5,7,-1],[3,13,6],[21,0]]],leg0:[[[-2.5,8,7]],[[-3.5,0,6],[-1.5,8,8],[0,18]]],leg1:[[[0.5,8,7]],[[-0.5,0,6],[1.5,8,8],[0,18]]],leg2:[[[-2.5,8,-4]],[[-3.5,0,-5],[-1.5,8,-3],[0,18]]],leg3:[[[0.5,8,-4]],[[-0.5,0,-5],[1.5,8,-3],[0,18]]],tail:[[[-1,12,8]],[[-2,4,7],[0,12,9],[9,18]]]},ocelot:{head:[[[0,9,-9]],[[-2.5,7,-12],[2.5,11,-7],[0,0]],[[-1.5,7.02,-13],[1.5,9.02,-11],[0,24]],[[-2,11,-9],[-1,12,-7],[0,10]],[[1,11,-9],[2,12,-7],[6,10]]],body:[[[0,12,-10]],[[-2,-7,-18],[2,9,-12],[20,0]]],tail1:[[[0,9,8],[-50,0,0]],[[-0.5,1,8],[0.5,9,9],[0,15]]],tail2:[[[0,4,13]],[[-0.5,-4,13],[0.5,4,14],[4,15]]],backLegL:[[[1.1,6,5]],[[0.1,0,6],[2.1,6,8],[8,13]]],backLegR:[[[-1.1,6,5]],[[-2.1,0,6],[-0.1,6,8],[8,13]]],frontLegL:[[[1.2,10.2,-5]],[[0.2,0.2,-5],[2.2,10.2,-3],[40,0]]],frontLegR:[[[-1.2,10.2,-5]],[[-2.2,0.2,-5],[-0.2,10.2,-3],[40,0]]]},trident:{pole:[[[0,24,0]],[[-0.5,-3,-0.5],[0.5,28,0.5],[0,0],0.01],[[-1.5,22,-0.5],[1.5,24,0.5],[4,0]],[[-2.5,23,-0.5],[-1.5,27,0.5],[4,3]]],rDent:[[[0,24,0]],[[1.5,23,-0.5],[2.5,27,0.5],[4,3],0,1]]},guardian:{head:[[[0,24,0]],[[-6,2,-8],[6,14,8],[0,0]],[[-8,2,-6],[-6,14,6],[0,28]],[[6,2,-6],[8,14,6],[0,28],0,1],[[-6,14,-6],[6,16,6],[16,40],0,1],[[-6,0,-6],[6,2,6],[16,40],0,1]],eye:[[[0,24,0]],[[-1,7,0],[1,9,1],[8,0]]],tailpart0:[[[0,24,0]],[[-2,6,7],[2,10,15],[40,0]]],tailpart1:[[[0,24,0]],[[0,7,0],[3,10,7],[0,54]]],tailpart2:[[[0,24,0]],[[0,8,0],[2,10,6],[41,32]],[[1,4.5,3],[2,13.5,12],[25,19]]],spikepart0:repeat.guardianSpike,spikepart1:repeat.guardianSpike,spikepart2:repeat.guardianSpike,spikepart3:repeat.guardianSpike,spikepart4:repeat.guardianSpike,spikepart5:repeat.guardianSpike,spikepart6:repeat.guardianSpike,spikepart7:repeat.guardianSpike,spikepart8:repeat.guardianSpike,spikepart9:repeat.guardianSpike,spikepart10:repeat.guardianSpike,spikepart11:repeat.guardianSpike},polarbear:{head:[[[0,14,-16]],[[-3.5,10,-19],[3.5,17,-12],[0,0]],[[-2.5,10,-22],[2.5,13,-19],[0,44]],[[-4.5,16,-17],[-2.5,18,-16],[26,0]],[[2.5,16,-17],[4.5,18,-16],[26,0]]],body:[[[-2,15,12]],[[-7,14,5],[7,28,16],[0,19]],[[-6,28,5],[6,40,15],[39,0]]],leg0:[[[-4.5,10,6]],[[-6.5,0,4],[-2.5,10,12],[50,22]]],leg1:[[[4.5,10,6]],[[2.5,0,4],[6.5,10,12],[50,22]]],leg2:[[[-3.5,10,-8]],[[-5.5,0,-10],[-1.5,10,-4],[50,40]]],leg3:[[[3.5,10,-8]],[[1.5,0,-10],[5.5,10,-4],[50,40]]]},villager:repeat.villager,witherBoss:{upperBodyPart1:[[[0,24,0]],[[-10,17.1,-0.5],[10,20.1,2.5],[0,16]]],upperBodyPart2:[[[-2,17.1,-0.5]],[[-2,7.1,-0.5],[1,17.1,2.5],[0,22]],[[-6,13.6,0],[5,15.6,2],[24,22]],[[-6,11.1,0],[5,13.1,2],[24,22]],[[-6,8.6,0],[5,10.6,2],[24,22]]],upperBodyPart3:[[[0,24,0]],[[0,18,0],[3,24,3],[12,22]]],head1:[[[0,20,0]],[[-4,20,-4],[4,28,4],[0,0]]],head2:[[[-9,18,-1]],[[-12,18,-4],[-6,24,2],[32,0]]],head3:[[[9,18,-1]],[[6,18,-4],[12,24,2],[32,0]]]},armor_stand:{head:[[[0,24,0]],[[-1,24,-1],[1,31,1],[0,0]]],body:[[[0,24,0]],[[-6,21,-1.5],[6,24,1.5],[0,26]],[[-3,14,-1],[-1,21,1],[16,0]],[[1,14,-1],[3,21,1],[48,16]],[[-4,12,-1],[4,14,1],[0,48]]],rightArm:[[[-5,22,0]],[[-7,12,-1],[-5,24,1],[24,0]]],leftArm:[[[5,22,0]],[[5,12,-1],[7,24,1],[32,16],0,1]],rightLeg:[[[-1.9,12,0]],[[-2.9,1,-1],[-0.9,12,1],[8,0]]],leftLeg:[[[1.9,12,0]],[[0.9,1,-1],[2.9,12,1],[40,16],0,1]],basePlate:[[[0,0,0]],[[-6,0,-6],[6,1,6],[0,32]]]},parrot:{head:[[[0,8.3,-2.8]],[[-1,6.8,-3.8],[1,9.8,-1.8],[2,2]]],head2:[[[0,26,-1]],[[-1,25.5,-3],[1,26.5,1],[10,0]]],beak1:[[[0,24.5,-1.5]],[[-0.5,23.5,-2],[0.5,25.5,-1],[11,7]]],beak2:[[[0,25.8,-2.5]],[[-0.5,23.8,-3],[0.5,25.5,-2],[16,7]]],body:[[[0,7.5,-3]],[[-1.5,1.5,-4.5],[1.5,7.5,-1.5],[2,8]]],tail:[[[0,2.9,1.2]],[[-1.5,-0.1,0.2],[1.5,3.9,1.2],[22,1]]],wing0:[[[1.5,7.1,-2.8]],[[1,2.1,-4.3],[2,7.1,-1.3],[19,8]]],wing1:[[[-1.5,7.1,-2.8]],[[-2,2.1,-4.3],[-1,7.1,-1.3],[19,8]]],feather:[[[0,26.1,0.2]],[[0,25.1,-1.9],[0,30.1,2.1],[2,18]]],leg0:[[[1,2,-1]],[[0.5,0,-0.5],[1.5,2,0.5],[14,18]]],leg1:[[[-1,2,-1]],[[-1.5,0,-0.5],[-0.5,2,0.5],[14,18]]]},bed:{bed:[[[0,24,0]],[[0,0,0],[16,32,6],[0,0]],[[3,31,6],[13,32,9],[38,2]],[[3,0,6],[13,1,9],[38,38]],[[15,3,6],[16,29,9],[52,6]],[[0,3,6],[1,29,9],[44,6]]],leg1:[[[5,22,0]],[[13,29,6],[16,32,9],[12,38]]],leg0:[[[-5,22,0]],[[0,29,6],[3,32,9],[0,38]]],leg3:[[[2,12,0]],[[13,0,6],[16,3,9],[12,44]]],leg2:[[[-2,12,0]],[[0,0,6],[3,3,9],[0,44]]]},player_head:{head:repeat.humanoid.head},dragon_head:{head:[[[0,24,0]],[[-8,16,-10],[8,32,6],[112,30]],[[-5,32,-4],[-3,36,2],[0,0]],[[3,32,-4],[5,36,2],[0,0],0,1]],snout:[[[0,24,0]],[[-6,20,-24],[6,25,-8],[176,44]],[[-5,25,-22],[-3,27,-18],[112,0]],[[3,25,-22],[5,27,-18],[112,0],0,1]],jaw:repeat.dragon.jaw},cod:{body:[[[0,0,0]],[[-1,0,1],[1,4,8],[0,0]],[[0.0,4.0,0],[0,5,6],[20,-6]],[[-0.0,-1,3.0],[0,0,5],[24,-2]]],head:[[[0,2,0]],[[-1.0,1.0,-3],[1,4,-2],[0,0]],[[-1,0,-2],[1,4,1],[11,0]]],leftFin:[[[1,1,0],[0,0,35]],[[1,0,0],[3,1,2],[24,4]]],rightFin:[[[-1,1,0],[0,0,-35]],[[-3,0,0],[-1,1,2],[24,1]]],tailfin:[[[0,0,8]],[[0,0,8],[0,4,14],[20,1]]]},'pufferfish.small':{body:[[[0,0,0]],[[-1.5,0,-1.5],[1.5,2,1.5],[0,27]],[[0.5,2,-1.5],[1.5,3,-0.5],[24,6]],[[-1.5,2,-1.5],[-0.5,3,-0.5],[28,6]]],tailfin:[[[0,0,0]],[[-1.5,1,1.5],[1.5,1,4.5],[-3,0]]],leftFin:[[[4,7,3]],[[1.5,0,-1.49],[2.5,1,0.51],[25,0]]],rightFin:[[[-4,7,1]],[[-2.5,0,-1.49],[-1.5,1,0.51],[25,0]]]},'pufferfish.mid':{body:[[[0,0,0]],[[-2.5,1,-2.5],[2.5,6,2.5],[12,22]]],leftFin:[[[4,7,3]],[[2.5,5,-1.49],[4.5,6,0.51],[24,3]]],rightFin:[[[-4,7,1]],[[-4,6,1],[-2,7,3],[24,0]]],spines_top_front:[[[-2.5,6,-2.5],[45,0,0]],[[-2.5,6,-2.5],[1.5,7,-1.5],[18,16]]],spines_top_back:[[[-2.5,6,2.5],[-45,0,0]],[[-1.5,6,1.5],[2.5,7,2.5],[10,16]]],spines_bottom_front:[[[-2.5,0,-2.5],[-45,0,0]],[[-2.5,0.5,-2.5],[2.5,1.5,-1.5],[17,19]]],spines_bottom_back:[[[0,1,2.5],[-45,0,0]],[[-2.5,0,2.5],[2.5,1,3.5],[17,20]]],spines_left_front:[[[2.5,0,-2.5],[0,45,0]],[[2.5,1,-2.5],[3.5,6,-1.5],[4,16]]],spines_left_back:[[[2.5,0,2.5],[0,-45,0]],[[2.5,1,2.5],[3.5,6,3.5],[4,16]]],spines_right_front:[[[-2.5,0,-2.5],[0,-45,0]],[[-3.5,1,-2.5],[-2.5,6,-1.5],[4,16]]],spines_right_back:[[[-2.5,0,2.5],[0,45,0]],[[-3.5,1,2.5],[-2.5,6,3.5],[8,16]]]},'pufferfish.large':{body:[[[0,0,0]],[[-4,0,-4],[4,8,4],[0,0]]],leftFin:[[[4,7,3]],[[4,6,-2.99],[6,7,-0.99],[24,3]]],rightFin:[[[-4,7,1]],[[-6.0,6,-2.99],[-4,7,-0.99],[24,0]]],spines_top_front:[[[-4,8,-4],[45,0,0]],[[-4,8,-4],[4,9,-3],[14,16]]],spines_top_mid:[[[0,8,0]],[[-4,8,0],[4,9,1],[14,16]]],spines_top_back:[[[0,8,4],[-45,0,0]],[[-4,8,4],[4,9,5],[14,16]]],spines_bottom_front:[[[0,0,-4],[-45,0,0]],[[-4,-1,-4],[4,0,-3],[14,19]]],spines_bottom_mid:[[[0,-1,0]],[[-4,-1,0],[4,0,1],[14,19]]],spines_bottom_back:[[[0,0,4],[-45,0,0]],[[-4,-1,4],[4,0,5],[14,20]]],spines_left_front:[[[4,0,-4],[0,45,0]],[[4,0,-4],[5,8,-3],[0,16]]],spines_left_mid:[[[4,0,0]],[[4,0,0],[5,8,1],[4,16]]],spines_left_back:[[[4,0,4],[0,-45,0]],[[4,0,4],[5,8,5],[8,16]]],spines_right_front:[[[-4,0,-4],[0,-45,0]],[[-5,0,-4],[-4,8,-3],[4,16]]],spines_right_mid:[[[-4,0,0]],[[-5,0,0],[-4,8,1],[8,16]]],spines_right_back:[[[-4,0,4],[0,45,0]],[[-5,0,4],[-4,8,5],[8,16]]]},salmon:{body_front:[[[0,0,-4]],[[-1.5,3.5,-4],[1.5,8.5,4],[0,0]]],body_back:[[[0,0,4]],[[-1.5,3.5,4],[1.5,8.5,12],[0,13]]],dorsal_front:[[[0,5,2]],[[0,8.5,2],[0,10.5,4],[4,2]]],dorsal_back:[[[0,5,4]],[[0,8.5,4],[0,10.5,7],[2,3]]],tailfin:[[[0,0,12]],[[0,3.5,12],[0,8.5,18],[20,10]]],head:[[[0,3,-4]],[[-1,4.5,-7],[1,8.5,-4],[22,0]]],leftFin:[[[1.5,1,-4],[0,0,35]],[[-0.51,3.87,-4],[1.49,3.87,-2],[2,0]]],rightFin:[[[-1.5,1,-4],[0,0,-35]],[[-1.49,3.87,-4],[0.51,3.87,-2],[-2,0]]]},tropicalfish_a:{body:[[[-0.5,0,0]],[[-1,0,-3],[1,3,3],[0,0]],[[0,3,-3.0],[0,7,3],[10,-6]]],tailfin:[[[0,0,3]],[[0,0,3],[0,3,7],[24,-4]]],leftFin:[[[0.5,0,1],[0,-35,0]],[[0.34,0,-0.11],[2.34,2,-0.11],[2,12]]],rightFin:[[[-0.5,0,1],[0,35,0]],[[-2.34,0,-0.11],[-0.34,2,-0.11],[2,16]]]},tropicalfish_b:{body:[[[-0.5,0,0]],[[-1,0,-0.0],[1,6,6],[0,20]],[[0,-5,-0.0],[0,0,6],[20,21]],[[0,6,-0.0],[0,11,6],[20,10]]],tailfin:[[[0,0,6]],[[0,0.0,6],[0,6,11],[21,16]]],leftFin:[[[0.5,0,1],[0,-35,0]],[[2.06,0,2.35],[4.06,2,2.35],[2,12]]],rightFin:[[[-0.5,0,1],[0,35,0]],[[-4.06,0,2.35],[-2.06,2,2.35],[2,16]]]},'creeper.charged':{body:[[[0,0,0]],[[-4,6,-2],[4,18,2],[16,16],2]],head:[[[0,18,0]],[[-4,18,-4],[4,26,4],[0,0],2]],leg0:[[[-2,6,4]],[[-4,0,2],[0,6,6],[0,16],2]],leg1:[[[2,6,4]],[[0,0,2],[4,6,6],[0,16],2]],leg2:[[[-2,6,-4]],[[-4,0,-6],[0,6,-2],[0,16],2]],leg3:[[[2,6,-4]],[[0,0,-6],[4,6,-2],[0,16],2]]},enderman:{body:[[[0,38,0]],[[-4,26,-2],[4,38,2],[32,16]]],head:repeat.humanoid.head,hat:[[[0,38,0]],[[-4,38,-4],[4,46,4],[0,16],-0.5]],rightArm:[[[-3,36,0]],[[-4,8,-1],[-2,38,1],[56,0]]],leftArm:[[[5,36,0]],[[4,8,-1],[6,38,1],[56,0],0,1]],rightLeg:[[[-2,26,0]],[[-3,-4,-1],[-1,26,1],[56,0]]],leftLeg:[[[2,26,0]],[[1,-4,-1],[3,26,1],[56,0],0,1]]},'sheep.sheared':{body:[[[0,19,2]],[[-4,13,-5],[4,29,1],[28,8]]],head:[[[0,18,-8]],[[-3,16,-14],[3,22,-6],[0,0]]],leg0:[[[-3,12,7]],[[-5,0,5],[-1,12,9],[0,16]]],leg1:[[[3,12,7]],[[1,0,5],[5,12,9],[0,16]]],leg2:[[[-3,12,-5]],[[-5,0,-7],[-1,12,-3],[0,16]]],leg3:[[[3,12,-5]],[[1,0,-7],[5,12,-3],[0,16]]]},pig:{body:[[[0,13,2]],[[-5,7,-5],[5,23,3],[28,8]]],head:[[[0,12,-6]],[[-4,8,-14],[4,16,-6],[0,0]],[[-2,9,-15],[2,12,-14],[16,16]]],leg0:[[[-3,6,7]],[[-5,0,5],[-1,6,9],[0,16]]],leg1:[[[3,6,7]],[[1,0,5],[5,6,9],[0,16]]],leg2:[[[-3,6,-5]],[[-5,0,-7],[-1,6,-3],[0,16]]],leg3:[[[3,6,-5]],[[1,0,-7],[5,6,-3],[0,16]]]},'zombie.villager':{body:repeat.villager.body,head:[[[0,24,0]],[[-4,24,-4],[4,34,4],[0,0]],[[-1,23,-6],[1,27,-4],[24,0],0.25]],rightArm:[[[-5,22,0]],[[-8,12,-2],[-4,24,2],[44,38]]],leftArm:[[[5,22,0]],[[4,12,-2],[8,24,2],[44,38],0,1]],rightLeg:repeat.villager.leg0,leftLeg:repeat.zombieVillagerLeftLeg},evoker:{head:repeat.villager.head,nose:repeat.villager.nose,body:repeat.villager.body,arms:repeat.villager.arms,leg0:repeat.villager.leg0,leg1:repeat.zombieVillagerLeftLeg,rightarm:repeat.illager.rightarm,leftarm:repeat.illager.leftarm},vex:{body:repeat.humanoid.body,head:repeat.humanoid.head,rightarm:repeat.humanoid.rightArm,leftarm:repeat.humanoid.leftArm,leg0:[[[-1.9,12,0]],[[-3.9,0,-2],[0.1,12,2],[0,16]],[[-2.9,3,-2],[3.1,13,2],[32,0]]],leftwing:[[[0,24,0]],[[0,12,0],[20,24,1],[0,32],0,1]],rightwing:[[[0,24,0]],[[-20,12,0],[0,24,1],[0,32]]]},'villager.witch':{head:repeat.villager.head,nose:[[[0,26,0]],[[0,25,-6.75],[1,26,-5.75],[0,0],-0.25],[[-1,23,-6],[1,27,-4],[24,0]]],body:repeat.villager.body,arms:repeat.villager.arms,leg0:repeat.villager.leg0,leg1:repeat.zombieVillagerLeftLeg,hat:[[[-5,32.03,-5]],[[-5,32.05,-5],[5,34.05,5],[0,64]]],hat2:[[[1.75,32,2],[-3,0,1.5]],[[-3.25,33.5,-3],[3.75,37.5,4],[0,76]]],hat3:[[[1.75,35,2],[-6,0,3]],[[-1.5,36.5,-1],[2.5,40.5,3],[0,87]]],hat4:[[[1.75,38,2],[-12,0,6]],[[0.25,40,1],[1.25,42,2],[0,95],0.25]]},'witherBoss.armor':{upperBodyPart1:[[[0,24,0]],[[-10,17.1,-0.5],[10,20.1,2.5],[0,16],2]],upperBodyPart2:[[[-2,17.1,-0.5]],[[-2,7.1,-0.5],[1,17.1,2.5],[0,22],2],[[-6,13.6,0],[5,15.6,2],[24,22],2],[[-6,11.1,0],[5,13.1,2],[24,22],2],[[-6,8.6,0],[5,10.6,2],[24,22],2]],upperBodyPart3:[[[0,24,0]],[[0,18,0],[3,24,3],[12,22],2]],head1:[[[0,20,0]],[[-4,20,-4],[4,28,4],[0,0],2]],head2:[[[-9,18,-1]],[[-12,18,-4],[-6,24,2],[32,0],2]],head3:[[[9,18,-1]],[[6,18,-4],[12,24,2],[32,0],2]]},skeleton:{body:repeat.humanoid.body,head:repeat.humanoid.head,rightArm:[[[-5,22,0]],[[-6,12,-1],[-4,24,1],[40,16]]],leftArm:[[[5,22,0]],[[4,12,-1],[6,24,1],[40,16],0,1]],rightLeg:[[[-2,12,0]],[[-3,0,-1],[-1,12,1],[0,16]]],leftLeg:[[[2,12,0]],[[1,0,-1],[3,12,1],[0,16],0,1]]},'stray.armor':{body:[[[0,24,0]],[[-4,12,-2],[4,24,2],[16,16],0.25]],head:[[[0,24,0]],[[-4,24,-4],[4,32,4],[0,0],0.25]],rightArm:[[[-5,22,0]],[[-8,12,-2],[-4,24,2],[40,16],0.25]],leftArm:[[[5,22,0]],[[4,12,-2],[8,24,2],[40,16],0.25,1]],rightLeg:[[[-1.9,12,0]],[[-3.9,0,-2],[0.1,12,2],[0,16],0.25]],leftLeg:[[[1.9,12,0]],[[-0.1,0,-2],[3.9,12,2],[0,16],0.25,1]]},sheep:{body:[[[0,19,2]],[[-4,13,-5],[4,29,1],[28,40],1.75]],head:[[[0,18,-8]],[[-3,16,-12],[3,22,-6],[0,32],0.6]],leg0:[[[-3,12,7]],[[-5,6,5],[-1,12,9],[0,48],0.5]],leg1:[[[3,12,7]],[[1,6,5],[5,12,9],[0,48],0.5]],leg2:[[[-3,12,-5]],[[-5,6,-7],[-1,12,-3],[0,48],0.5]],leg3:[[[3,12,-5]],[[1,6,-7],[5,12,-3],[0,48],0.5]]},boat:{bottom:[[[0,18,0],[-90,0,0]],[[-14,10,0],[14,26,3],[0,0]]],front:[[[-15,24,0],[0,-90,0]],[[-23,21,-1],[-7,27,1],[0,27]]],back:[[[15,24,0],[0,90,0]],[[6,21,-1],[24,27,1],[0,19]]],right:[[[0,24,-9],[0,180,0]],[[-14,21,-10],[14,27,-8],[0,35]]],left:[[[0,24,9]],[[-14,21,8],[14,27,10],[0,43]]],paddle_left:[[[2.5,28,9]],[[1.5,27,3.5],[3.5,29,21.5],[62,0]],[[1.51,26,17.5],[2.51,32,24.5],[62,0]]],paddle_right:[[[2.5,28,-9]],[[1.5,27,-14.5],[3.5,29,3.5],[62,20]],[[2.49,26,-0.5],[3.49,32,6.5],[62,20]]]},minecart:{bottom:[[[0,20,0],[-90,0,0]],[[-10,12,-1],[10,28,1],[0,10]]],front:[[[9,25,0],[0,90,0]],[[1,21,-1],[17,29,1],[0,0]]],back:[[[-9,25,0],[0,-90,0]],[[-17,21,-1],[-1,29,1],[0,0]]],right:[[[0,25,-7],[0,180,0]],[[-8,21,-8],[8,29,-6],[0,0]]],left:[[[0,25,7]],[[-8,21,6],[8,29,8],[0,0]]]},endermite:{bodyPart_0:[[[0,0,-3.5]],[[-2,0,-4.5],[2,3,-2.5],[0,0]]],bodyPart_1:[[[0,0,0]],[[-3,0,-2.5],[3,4,2.5],[0,5]]],bodyPart_2:[[[0,0,3]],[[-1.5,0,2.5],[1.5,3,3.5],[0,14]]],bodyPart_3:[[[0,0,4]],[[-0.5,0,3.5],[0.5,2,4.5],[0,18]]]}}

//Copies humanoid bones so the hat isn't added to 'humanoid' as well
entity_bones.pigzombie = Object.assign({},repeat.humanoid)
//Adds in zombie pigmans hat layer
//Everything else is the same as 'humanoid'
entity_bones.pigzombie.hat = [[[0,24,0]],[[-4,24,-4],[4,32,4],[32,0],0.5]]

/***********************************\
|           DIALOG WINDOW           |
\***********************************/

//Dropdown selection used in the dialog window
var bedrock_entity_list = `Select an entity: 
<select style="color:var(--color-text)" id="bedrock_entity_list">
<option value="armor_stand">Armor Stand</option>
<option value="bat">Bat</option>
<option value="bed">Bed</option>
<option value="blaze">Blaze</option>
<option value="boat">Boat</option>
<option value="ocelot">Cat</option>
<option value="chicken">Chicken</option>
<option value="cod">Cod</option>
<option value="cow">Cow</option>
<option value="creeper">Creeper</option>
<option value="creeper.charged">Charged Creeper Armor</option>
<option value="dolphin">Dolphin</option>
<option value="zombie.drowned">Drowned</option>
<option value="enderman">Enderman</option>
<option value="endermite">Endermite</option>
<option value="dragon">Ender Dragon</option>
<option value="dragon_head">Ender Dragon Head</option>
<option value="evoker">Evoker</option>
<option value="ghast">Ghast</option>
<option value="guardian">Guardian</option>
<option value="horse">Horse (Old)</option>
<option value="horse.v2">Horse (New)</option>
<option value="humanoid">Humanoid</option>
<option value="zombie.husk">Husk</option>
<option value="irongolem">Iron Golem</option>
<option value="llama">Llama</option>
<option value="llamaspit">Llama Spit</option>
<option value="lavaslime">Magma Cube</option>
<option value="minecart">Minecart</option>
<option value="mob_head">Mob Head</option>
<option value="mooshroom">Mooshroom Cow</option>
<option value="parrot">Parrot</option>
<option value="pig">Pig</option>
<option value="player_head">Player Head</option>
<option value="polarbear">Polarbear</option>
<option value="pufferfish.small">Pufferfish (Small)</option>
<option value="pufferfish.mid">Pufferfish (Medium)</option>
<option value="pufferfish.large">Pufferfish (Large)</option>
<option value="rabbit">Rabbit</option>
<option value="salmon">Salmon</option>
<option value="sheep.sheared">Sheep (Sheared)</option>
<option value="sheep">Sheep (Wool)</option>
<option value="shulker">Shulker</option>
<option value="silverfish">Silverfish</option>
<option value="skeleton">Skeleton</option>
<option value="slime">Slime (Inner Cube)</option>
<option value="slime.armor">Slime (Outer Cube)</option>
<option value="snowgolem">Snow Golem</option>
<option value="spider">Spider</option>
<option value="squid">Squid</option>
<option value="skeleton.stray">Stray</option>
<option value="stray.armor">Stray (Robes)</option>
<option value="trident">Trident</option>
<option value="tropicalfish_a">Tropical Fish (A)</option>
<option value="tropicalfish_b">Tropical Fish (B)</option>
<option value="vex">Vex</option>
<option value="villager">Villager</option>
<option value="vindicator">Vindicator</option>
<option value="villager.witch">Witch</option>
<option value="witherBoss">Wither Boss</option>
<option value="witherBoss.armor">Wither Boss Armor</option>
<option value="skeleton.wither">Wither Skeleton</option>
<option value="wolf">Wolf</option>
<option value="zombie">Zombie</option>
<option value="pigzombie">Zombie Pigman</option>
<option value="pigzombie.baby">Zombie Pigman (Baby)</option>
<option value="zombie.villager">Zombie Villager</option>
</select>`

//Dialog window
var bedrock_entity_selector = new Dialog({title:'Entity Selector', id:'entity_selector', lines:[bedrock_entity_list + '<br/><p>Create entity model  <input type="checkbox" id="mob_model"></p>', '<p>Add default entity parent  <input type="checkbox" id="mob_parent"></p>', '<br>']})

//Runs when 'confirm' is clicked on the dialog window
bedrock_entity_selector.onConfirm = function() {

	//Gets the entity from the dropdown list selected in the dialog window
	entity = $('#bedrock_entity_list')[0].value

	//Changes the project texture size to the default texture size of the chosen entity
	changeTextureSizes(entity)

	//Passes whether 'Create entity model' is checked to the function
	createBones(entity, $('#mob_model')[0].checked)
	//Changes the project name to the correct value for the entity selected
	Project.geometry_name = getEntityName(entity, $('#mob_parent')[0].checked)
	//Sets the file name to the default mobs.json, if there isn't a file name
	if (Project.name == '') Project.name = 'mobs.json'

	Canvas.updateAll()

	//Hides the dialog window
	bedrock_entity_selector.hide()
}

/***********************************\
|            MENU ENTRY             |
\***********************************/

//Adds an entry to the plugin menu
Blockbench.addMenuEntry('Bedrock Entity Generator', 'pets', function() {
	bedrock_entity_selector.show()
})

/***********************************\
|         UNINSTALL PLUGIN          |
\***********************************/

onUninstall = function() {
	//Removes the menu entry
	Blockbench.removeMenuEntry('Bedrock Entity Generator')
}