import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { CategoryModel, ICategory } from "../database/models/category";

const populate = ["parent", "children"];

const CategoryService = {
  findOne: async (
    condition: Partial<ICategory>
  ): Promise<any | null | undefined> => {
    return await CategoryModel.findOne(condition).populate(populate);
  },

  updateParent: async (
    id: string,
    parentId: string
  ): Promise<any | null | undefined> => {
    let parent: ICategory | null = null;
    let newParent: ICategory | null = null;
    let found: ICategory = await CategoryService.findOne({ _id: id });

    if (!found) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Category not found");
    }

    if (found.children?.length) {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        "You can not change Parent Category"
      );
    }

    parent = await CategoryService.findOne({
      // @ts-ignore
      _id: found.parent._id,
    });

    if (parent && parent._id.toString() === parentId) {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        "Parent Category must be another Category"
      );
    }

    newParent = await CategoryService.findOne({
      _id: parentId,
    });

    if (!newParent) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Parent Category not found");
    }

    if (parent) {
      parent.children = [
        ...(parent.children ?? []).filter((p) => p._id.toString() !== id),
      ];
      await CategoryModel.findByIdAndUpdate(parent._id, parent);
    }

    newParent.children = [...(newParent.children as any[]), found._id];
    await CategoryModel.findByIdAndUpdate(newParent._id, newParent);

    // @ts-ignore
    found.parent = newParent._id;
    await CategoryModel.findByIdAndUpdate(found._id, found);

    return found;
  },

  updateChildren: async (
    _id: string,
    children: string[]
  ): Promise<any | null | undefined> => {
    let found: ICategory = await CategoryService.findOne({ _id });

    if (!found) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Category not found");
    }

    const oldChildren: string[] = [];
    const sameChildren: string[] = [];
    const newChildren: string[] = [];

    if (found.children) {
      for (let i = 0; i < found.children.length; i++) {
        for (let j = 0; j < (children as string[]).length; j++) {
          if (found.children[i]._id.toString() === children[j])
            sameChildren.push(children[j]);
        }
      }

      for (let i = 0; i < found.children.length; i++) {
        let isOld = true;

        for (let j = 0; j < sameChildren.length; j++) {
          if (found.children[i]._id.toString() === sameChildren[j]) {
            isOld = false;
          }
        }

        if (isOld) {
          oldChildren.push(found.children[i]._id.toString());
        }
      }

      for (let i = 0; i < (children as string[]).length; i++) {
        let isNew = true;

        for (let j = 0; j < sameChildren.length; j++) {
          if (children[i] === sameChildren[j]) {
            isNew = false;
          }
        }

        if (isNew) {
          const foundNew = await CategoryModel.findById(children[i]);
          if (foundNew) {
            newChildren.push(children[i]);
          }
        }
      }
    }

    for (let i = 0; i < oldChildren.length; i++) {
      await CategoryModel.findByIdAndUpdate(oldChildren[i], {
        $set: { parent: null },
      });
    }

    for (let i = 0; i < newChildren.length; i++) {
      await CategoryModel.findByIdAndUpdate(newChildren[i], {
        $set: { parent: _id },
      });
    }

    // @ts-ignore
    found.children = [...sameChildren, ...newChildren];
    await CategoryModel.findByIdAndUpdate(found._id, found);

    return found;
  },

  delete: async (id: string): Promise<void> => {
    let found: ICategory = await CategoryService.findOne({ _id: id });

    if (!found) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Category not found");
    }

    if (found.children?.length) {
      await CategoryModel.deleteMany({
        _id: { $in: found.children.map((f) => f._id) },
      });
    }

    if (found.parent) {
      let parent: ICategory = await CategoryService.findOne({
        // @ts-ignore
        _id: found.parent._id,
      });

      parent.children = parent.children?.filter((c) => c._id.toString() !== id);

      await CategoryModel.findByIdAndUpdate(parent._id, parent);
    }

    await CategoryModel.findByIdAndDelete(id);
  },
};

export default CategoryService;
