import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import {getOverlap, getOverlapPercent} from '../Utils'

describe('test Utils', () => {
    
    it('check truthy', () => {
      expect(getOverlap).toBeTruthy();
    })

    it('check basic overlap', () => {
      const r1 = {left:0, right:100, width:100, height:100, top:0, bottom:100};
      const r2 = {left:100, right:200, width:100, height:100, top:0, bottom:100};
      expect(getOverlapPercent(r1, r2)).toEqual(0);
      expect(getOverlapPercent(r1, r1)).toEqual(100);
      expect(getOverlapPercent(r2, r2)).toEqual(100);
    })

    it('check three squares', () => {
      const r1 = {left:0, right:100, width:100, height:100, top:0, bottom:100};
      const r2 = {left:50, right:150, width:100, height:100, top:0, bottom:100};
      const r3 = {left:0, right:100, width:100, height:100, top:50, bottom:150};
      
      expect(getOverlapPercent(r1, r2, {x: true, y:false})).toEqual(50);
      expect(getOverlapPercent(r1, r2, {x: false, y:true})).toEqual(100);
      expect(getOverlapPercent(r1, r2, {x: true, y:true})).toEqual(50);

      expect(getOverlapPercent(r1, r3, {x: true, y:false})).toEqual(100);
      expect(getOverlapPercent(r1, r3, {x: false, y:true})).toEqual(50);
      expect(getOverlapPercent(r1, r3, {x: true, y:true})).toEqual(50);

      expect(getOverlapPercent(r2, r3, {x: true, y:false})).toEqual(50);
      expect(getOverlapPercent(r2, r3, {x: false, y:true})).toEqual(50);
      expect(getOverlapPercent(r2, r3, {x: true, y:true})).toEqual(25);

    })

    it('check a typical story use-case', () => {
      const r1 = {left:0, right:100, width:100, height:20, top:90, bottom:110};
      const r2 = {left:0, right:100, width:100, height:100, top:0, bottom:100};
      
      expect(getOverlapPercent(r1, r2, {x: true, y:false})).toEqual(100);
      expect(getOverlapPercent(r1, r2, {x: false, y:true})).toEqual(50);
      expect(getOverlapPercent(r1, r2, {x: true, y:true})).toEqual(50);

    })

    it('check another typical story use-case', () => {
      const r1 = {left:50, right:100, width:50, height:20, top:90, bottom:110};
      const r2 = {left:0, right:100, width:100, height:100, top:0, bottom:100};
      
      expect(getOverlapPercent(r1, r2, {x: true, y:false})).toEqual(100);
      expect(getOverlapPercent(r1, r2, {x: false, y:true})).toEqual(50);
      expect(getOverlapPercent(r1, r2, {x: true, y:true})).toEqual(50);

    })

})
