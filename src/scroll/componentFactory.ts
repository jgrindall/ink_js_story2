
import { SectionType } from '../types/enums';
import type { HasId, Section } from '../types/types';
import CodeView from "../components/CodeView.vue"
import TextView from "../components/TextView.vue"
import ImageView from "../components/ImageView.vue"
import ChoicesView from "../components/ChoicesView.vue"

export default function useComponentFactory(){

    const components = {
        [SectionType.CODE]: CodeView,
        [SectionType.TEXT]: TextView,
        [SectionType.IMAGE]: ImageView,
        [SectionType.CHOICES]: ChoicesView
    };

    function componentFactory(item: HasId):any{
        let type = ((item as unknown) as Section).type;
        return components[type];
    };

    return {
        componentFactory
    }
}
