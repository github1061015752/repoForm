import { sj } from '@/services/domain/util';
import { SortOrder } from '@/types/data';
import { defineComponent, PropType, ref } from 'vue';

const StSort = defineComponent({
  props: {
    defaultOrder: { type: String as PropType<SortOrder>, default: null },
    defaultColor: { type: String, default: 'border-gray-100' },
    activeColor: { type: String, default: 'border-blue-650' }
  },
  emits: ['changeSort'],
  setup(props, { emit }) {
    const order = ref(null as SortOrder);
    const changeOrder = (event: MouseEvent) => {
      const canChange = sj.obtain({
        get: () => (event.target as HTMLElement).dataset.sortIcon !== undefined,
        alternative: false
      });
      if (!canChange) return;

      const { sortIcon } = (event.target as HTMLElement).dataset;
      const prevOrder = order.value;
      const shouldReset = sortIcon === prevOrder;
      if (shouldReset) {
        order.value = null;
      } else {
        order.value = sortIcon as SortOrder;
      }

      emit('changeSort', order);
    };

    return () => (
      <div
        class="w-6 h-[1.35rem] align-middle text-center inline-block relative"
        onClick={changeOrder}
      >
        <i
          data-sort-icon="asc"
          class={{
            'vxe-icon--caret-top absolute top-[0.05em] cursor-pointer': true,
            [props.defaultColor]: order.value !== 'asc',
            [props.activeColor]: order.value === 'asc'
          }}
        ></i>
        <i
          data-sort-icon="desc"
          class={{
            'vxe-icon--caret-bottom absolute bottom-[0.05em] cursor-pointer': true,
            [props.defaultColor]: order.value !== 'desc',
            [props.activeColor]: order.value === 'desc'
          }}
        ></i>
      </div>
    );
  }
});

export default StSort;
