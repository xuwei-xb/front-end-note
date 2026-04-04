import { Container } from './hostConfig';
import { ReactElement, ReactElementType } from 'shared/ReactTypes';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import { UpdateQueue, createUpdate, createUpdateQueue, enqueueUpdate } from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import { requestUpdateLane } from './fiberLanes';

//setstate -> scheduleUpdateOnFiber -> scheduleWork ->

//requestWork -> scheduleWork -> performSyncWorkOnRoot -> renderRootSync -> workLoopSync -> performUnitOfWork -> beginWork

export function createContainer(container: Container) {
  //根据页面中真实的dom hostRootFiber
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue();
  return root;
}

export function updateContainer(element: ReactElement | null, root: FiberRootNode) {
  const hostRootFiber = root.current;
  const lane = requestUpdateLane();
  const update = createUpdate<ReactElementType | null>(element, lane);
  enqueueUpdate(hostRootFiber.updateQueue as UpdateQueue<ReactElement | null>, update);
  scheduleUpdateOnFiber(hostRootFiber, lane);
  return element;
}

