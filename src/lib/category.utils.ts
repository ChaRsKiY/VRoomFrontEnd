import {ICategoryBlock} from "@/components/pages/home/aside/category.interface";

export function validateCategoryBlock(categoryBlock: ICategoryBlock) {
    categoryBlock.data.forEach((item, index) => {
        const { icon, iconPath, name } = item;
        if ((!icon && !iconPath) || (icon && iconPath)) {
            throw new Error(
                `Item at index ${index} (${name}) must have either 'icon' or 'iconPath', but not both.`
            );
        }
    });
}