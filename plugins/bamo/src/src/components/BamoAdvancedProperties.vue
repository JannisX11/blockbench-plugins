<script>

import { rotationTypes, soundOptions, materialOptions, transparencyOptions, tabOptions, particleOptions, customTypeOptions } from '../util/OptionArrays.js';

export default {
    data() {
        return {
            step: "start",
            rotationTypes: rotationTypes,
            soundOptions: soundOptions,
            materialOptions: materialOptions,
            transparencyOptions: transparencyOptions,
            tabOptions: tabOptions,
            particleOptions: particleOptions,
            customTypeOptions: customTypeOptions,
            parentData: this.$parent.$data
        }
    },
    methods: {

        Textures(){
            return Texture.all
        },

        createJSON(){
            this.$parent.createJSON()
        },

        changePage(event, page){
            if (this.parentData.properties.displayName == ""){
                this.parentData.error = "name"
            }else{

                if ((this.step == "types" && page == "physical") || (this.step == "physical" && page == "types")){
                    if (this.parentData.properties.types.block) {page = "variant"} else {page = "custom"}
                }

                this.parentData.error = ""
                this.step = page
            }
        },

        toggleType(event, type){
            
            if (this.parentData.properties.types.custom && type=="custom"){
                this.parentData.properties.types.block = false
                this.parentData.properties.types.stair = false
                this.parentData.properties.types.slab = false
                this.parentData.properties.types.wall = false
                return
            }

            if (this.parentData.properties.types.block && type=="block"){
                this.parentData.properties.types.custom = false
                return
            }
        },

        reset(event){
            this.parentData.error = ""
            this.step = "start"
        },

    }
}
</script>

<template src="./BamoAdvancedTemplate.html"></template>
<style scoped> @import './bamo.css'; </style>