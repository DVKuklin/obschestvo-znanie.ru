<template>
    <div class="paginateButtons" v-if="pageCount<8">
        <PaginateButton v-for="(item,i) in links" :key="i"
            v-bind:query="query"
            v-bind:content="item.label"
            v-bind:page="item.page"
            v-bind:isActive="item.active"
        ></PaginateButton>
    </div> 

    <!-- Сокращенная пагинация -->
    <div class="paginateButtons" v-if="pageCount>=8">
        <PaginateButton
            v-bind:query="query"
            v-bind:content="links[0].label"
            v-bind:page="links[0].page"
            v-bind:isActive="links[0].active"
        ></PaginateButton>
        <PaginateButton
            v-if="pagePosition != 'left'"
            v-bind:query="query"
            v-bind:content="links[1].label"
            v-bind:page="links[1].page"
            v-bind:isActive="links[1].active"
        ></PaginateButton>
        <span v-if="leftPoints">...</span>
        <PaginateButton v-for="(item,i) in threeLinks" :key="i"
            v-bind:query="query"
            v-bind:content="item.label"
            v-bind:page="item.page"
            v-bind:isActive="item.active"
        ></PaginateButton>
        <span v-if="rightPoints">...</span>
        <PaginateButton
            v-if="pagePosition != 'right'"
            v-bind:query="query"
            v-bind:content="links[links.length-2].label"
            v-bind:page="links[links.length-2].page"
            v-bind:isActive="links[links.length-2].active"
        ></PaginateButton>
        <PaginateButton
            v-bind:query="query"
            v-bind:content="links[links.length-1].label"
            v-bind:page="links[links.length-1].page"
            v-bind:isActive="links[links.length-1].active"
        ></PaginateButton>
    </div> 
</template>

<script>
import PaginateButton from './PaginateButton.vue';

export default{
    name:'PaginateButtons',
    components: {PaginateButton},
    data() {
        return {
            pageCount: 0,
            activePage: '',
            threeLinks: [],
            pagePosition: '',
            leftPoints: false,//Показывать/скрывать левое многоточие между кнопками
            rightPoints: false,//Показывать/скрывать правое многоточие между кнопками
        }
    },
    props: [
        'links',
        'query',
    ],
    created() {
    },
    methods: {
        update() {
            this.pageCount = this.links.length;

            if(this.links.length >= 8) {
                for (let i=1;i<this.links.length-1;i++) {
                    
                    if (this.links[i].active) {
                        if (i==1) {
                            this.threeLinks[0]=this.links[1];
                            this.threeLinks[1]=this.links[2];
                            this.threeLinks[2]=this.links[3];
                            this.pagePosition = 'left';
                            this.leftPoints = false;
                            this.rightPoints = true;
                        } else if (i==this.links.length-2) {
                            this.threeLinks[0]=this.links[i-2];
                            this.threeLinks[1]=this.links[i-1];
                            this.threeLinks[2]=this.links[i];       
                            this.pagePosition = 'right';
                            this.leftPoints = true; 
                            this.rightPoints = false;           
                        } else {
                            this.threeLinks[0]=this.links[i-1];
                            this.threeLinks[1]=this.links[i];
                            this.threeLinks[2]=this.links[i+1]; 
                            if (i==2) {
                                this.pagePosition = 'left';
                            } else if(i==this.links.length-3)  {
                                this.pagePosition = 'right';
                            } else {
                                this.pagePosition = 'center';
                            }        

                            if (this.pagePosition != 'left' && i>3) {
                                this.leftPoints = true;
                            } else {
                                this.leftPoints = false;
                            } 
                            if (this.pagePosition != 'right'  && i<this.links.length-4) {
                                this.rightPoints = true;
                            } else {
                                this.rightPoints = false;
                            }    
                        }
                    }
                }
                
            }
        }
    },
    updated() {
        

    },
    watch: {
        links: function() {
            this.update();
        }
    }
}

</script>
<style>
.paginateButtons {
    margin: 0.4rem 0;
}
</style>
